import { requireAdminToken, json } from '../../_auth.js';

const MAX_IMAGE_PDF_BYTES = 20 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

const extensions = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
  'application/pdf': 'pdf',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

export function validFileBytes(bytes, type) {
  if (!bytes || bytes.length < 8) return false;
  const text = new TextDecoder().decode(bytes.slice(0, 256));
  if (type === 'image/jpeg') return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (type === 'image/png') return [137, 80, 78, 71, 13, 10, 26, 10].every((n, i) => bytes[i] === n);
  if (type === 'image/webp') return text.slice(0, 4) === 'RIFF' && text.slice(8, 12) === 'WEBP';
  if (type === 'image/gif') return /^GIF8[79]a/.test(text);
  if (type === 'image/avif') return text.slice(4, 8) === 'ftyp' && /avif|avis/.test(text.slice(8, 64));
  if (type === 'application/pdf') return text.startsWith('%PDF-');
  if (type === 'video/mp4') {
    // ISO Base Media File Format (ftyp atom at offset 4..8, or moov/mdat/free/wide)
    const boxType = new TextDecoder().decode(bytes.slice(4, 8));
    if (['ftyp', 'moov', 'mdat', 'free', 'wide', 'styp'].includes(boxType)) return true;
    return false;
  }
  if (type === 'video/webm') {
    // Matroska / WebM EBML magic bytes: 0x1A 0x45 0xDF 0xA3
    return bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3;
  }
  if (type === 'image/svg+xml') {
    const svg = new TextDecoder().decode(bytes);
    return (
      /<svg[\s>]/i.test(svg) &&
      !/<\s*(?:script|foreignObject|iframe|object|embed|style|a)(?:\s|>)/i.test(svg) &&
      !/(?:\son\w+\s*=|javascript\s*:|data\s*:|<!ENTITY|url\s*\(|(?:href|src)\s*=\s*['"]\s*(?!#))/i.test(svg)
    );
  }
  return false;
}

function safeName(name, type) {
  const base =
    String(name || '')
      .replace(/\.[^.]*$/, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/gi, 'd')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'media';
  return base.slice(0, 70) + '.' + extensions[type];
}

async function ensureMediaMetadataTable(context) {
  if (!context.env.DB) return;
  await context.env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS website_media_metadata(key TEXT PRIMARY KEY,alt TEXT NOT NULL DEFAULT '',caption TEXT NOT NULL DEFAULT '',credit TEXT NOT NULL DEFAULT '',source_url TEXT NOT NULL DEFAULT '',focal_x REAL NOT NULL DEFAULT 50,focal_y REAL NOT NULL DEFAULT 50,display_mode TEXT NOT NULL DEFAULT 'original',media_category TEXT NOT NULL DEFAULT 'general',version_status TEXT NOT NULL DEFAULT 'archived',duration_seconds REAL NOT NULL DEFAULT 0,width INTEGER NOT NULL DEFAULT 0,height INTEGER NOT NULL DEFAULT 0,poster_url TEXT NOT NULL DEFAULT '',updated_at TEXT NOT NULL)"
  ).run();
  const columns = await context.env.DB.prepare('PRAGMA table_info(website_media_metadata)').all();
  const names = new Set((columns.results || []).map((x) => x.name));
  const wanted = [
    ['credit', "TEXT NOT NULL DEFAULT ''"],
    ['source_url', "TEXT NOT NULL DEFAULT ''"],
    ['focal_x', 'REAL NOT NULL DEFAULT 50'],
    ['focal_y', 'REAL NOT NULL DEFAULT 50'],
    ['display_mode', "TEXT NOT NULL DEFAULT 'original'"],
    ['media_category', "TEXT NOT NULL DEFAULT 'general'"],
    ['version_status', "TEXT NOT NULL DEFAULT 'archived'"],
    ['duration_seconds', 'REAL NOT NULL DEFAULT 0'],
    ['width', 'INTEGER NOT NULL DEFAULT 0'],
    ['height', 'INTEGER NOT NULL DEFAULT 0'],
    ['poster_url', "TEXT NOT NULL DEFAULT ''"],
  ];
  for (const [colName, colType] of wanted) {
    if (!names.has(colName)) {
      await context.env.DB.prepare(`ALTER TABLE website_media_metadata ADD COLUMN ${colName} ${colType}`).run();
    }
  }
}

export async function onRequestPost(context) {
  const denied = await requireAdminToken(context, 'media.manage');
  if (denied) return denied;
  if (!context.env.MEDIA) {
    return json({ ok: false, error: 'Kho tệp chưa sẵn sàng. Kiểm tra binding MEDIA.' }, { status: 503 });
  }
  try {
    const form = await context.request.formData();
    const file = form.get('file');
    if (!file || typeof file !== 'object' || typeof file.arrayBuffer !== 'function') {
      return json({ ok: false, error: 'Chưa chọn tệp.' }, { status: 400 });
    }
    const mimeType = String(file.type || '');
    const fileName = String(file.name || 'upload.bin');
    if (!extensions[mimeType]) {
      return json(
        { ok: false, error: 'Hỗ trợ JPG, PNG, WebP, GIF, AVIF, SVG, PDF hoặc Video (MP4/WebM).' },
        { status: 400 }
      );
    }
    const isVideo = mimeType.startsWith('video/');
    const maxAllowed = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_PDF_BYTES;
    if (!file.size || file.size > maxAllowed) {
      return json(
        {
          ok: false,
          error: isVideo
            ? 'Tệp video phải có dữ liệu và không vượt quá 50 MB.'
            : 'Mỗi tệp phải có dữ liệu và không vượt quá 20 MB.',
        },
        { status: 400 }
      );
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!validFileBytes(bytes, mimeType)) {
      return json(
        { ok: false, error: 'Nội dung tệp không khớp chữ ký định dạng hoặc SVG chứa mã không an toàn.' },
        { status: 400 }
      );
    }
    const now = new Date();
    const category = String(form.get('category') || (isVideo ? 'intro_video' : 'general')).trim().slice(0, 40);
    const versionStatus = ['draft', 'active', 'archived'].includes(String(form.get('versionStatus') || ''))
      ? String(form.get('versionStatus'))
      : isVideo
      ? 'draft'
      : 'archived';
    const durationSeconds = Math.max(0, Math.min(600, Number(form.get('durationSeconds') || 0) || 0));
    const width = Math.max(0, Math.min(7680, Math.round(Number(form.get('width') || 0) || 0)));
    const height = Math.max(0, Math.min(4320, Math.round(Number(form.get('height') || 0) || 0)));
    const posterUrl = String(form.get('posterUrl') || '').trim().slice(0, 500);
    const caption = String(form.get('caption') || '').trim().slice(0, 500);

    const subFolder = category === 'intro_video' || category === 'intro_poster' ? 'intro' : `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const key = `website/${subFolder}/${crypto.randomUUID()}-${safeName(fileName, mimeType)}`;

    await context.env.MEDIA.put(key, bytes, {
      httpMetadata: { contentType: mimeType, cacheControl: 'public, max-age=31536000, immutable' },
      customMetadata: {
        originalName: fileName.slice(0, 255),
        uploadedAt: now.toISOString(),
        category,
        versionStatus,
        durationSeconds: String(durationSeconds),
        width: String(width),
        height: String(height),
      },
    });

    if (context.env.DB) {
      await ensureMediaMetadataTable(context);
      await context.env.DB.prepare(
        `INSERT INTO website_media_metadata(key,alt,caption,credit,source_url,focal_x,focal_y,display_mode,media_category,version_status,duration_seconds,width,height,poster_url,updated_at)
         VALUES(?,?,?,?,?,50,50,'original',?,?,?,?,?,?,?)
         ON CONFLICT(key) DO UPDATE SET
           media_category=excluded.media_category,
           version_status=excluded.version_status,
           duration_seconds=excluded.duration_seconds,
           width=excluded.width,
           height=excluded.height,
           poster_url=excluded.poster_url,
           updated_at=excluded.updated_at`
      )
        .bind(
          key,
          fileName.slice(0, 250),
          caption,
          '',
          '',
          category,
          versionStatus,
          durationSeconds,
          width,
          height,
          posterUrl,
          now.toISOString()
        )
        .run();
    }

    return json({
      ok: true,
      key,
      url: `/media/${key}`,
      name: fileName,
      size: file.size,
      type: mimeType,
      category,
      versionStatus,
      durationSeconds,
      width,
      height,
      posterUrl,
      uploaded: now.toISOString(),
    });
  } catch (error) {
    console.error('Media upload failed', error);
    return json({ ok: false, error: 'Không thể lưu tệp. Vui lòng thử lại.' }, { status: 500 });
  }
}
