import { requireAdminToken, json } from '../../_auth.js';

const validKey = (key) =>
  typeof key === 'string' && key.startsWith('website/') && !key.includes('..') && key.length < 1024;

async function metadataSchema(context) {
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
  for (const [name, type] of wanted) {
    if (!names.has(name)) {
      await context.env.DB.prepare(`ALTER TABLE website_media_metadata ADD COLUMN ${name} ${type}`).run();
    }
  }
}

export async function onRequestGet(context) {
  const denied = await requireAdminToken(context, 'media.manage');
  if (denied) return denied;
  if (!context.env.MEDIA) return json({ ok: false, error: 'Kho tệp chưa sẵn sàng.' }, { status: 503 });
  try {
    await metadataSchema(context);
    const url = new URL(context.request.url);
    const categoryFilter = String(url.searchParams.get('category') || '').trim();
    const prefix = categoryFilter === 'intro' ? 'website/intro/' : 'website/';
    const listed = await context.env.MEDIA.list({
      prefix,
      limit: 100,
      cursor: url.searchParams.get('cursor') || undefined,
      include: ['httpMetadata', 'customMetadata'],
    });
    let metadata = new Map();
    if (listed.objects.length) {
      const rows = await context.env.DB.prepare(
        `SELECT key,alt,caption,credit,source_url,focal_x,focal_y,display_mode,media_category,version_status,duration_seconds,width,height,poster_url FROM website_media_metadata WHERE key IN (${listed.objects.map(() => '?').join(',')})`
      )
        .bind(...listed.objects.map((o) => o.key))
        .all();
      metadata = new Map((rows.results || []).map((row) => [row.key, row]));
    }
    return json({
      ok: true,
      items: listed.objects.map((o) => {
        const meta = metadata.get(o.key);
        const contentType = o.httpMetadata?.contentType || '';
        return {
          key: o.key,
          url: `/media/${o.key}`,
          size: o.size,
          uploaded: o.uploaded || o.customMetadata?.uploadedAt || '',
          type: contentType,
          name: o.customMetadata?.originalName || o.key.split('/').pop(),
          alt: meta?.alt || '',
          caption: meta?.caption || '',
          credit: meta?.credit || '',
          sourceUrl: meta?.source_url || '',
          focalX: Number(meta?.focal_x ?? 50),
          focalY: Number(meta?.focal_y ?? 50),
          displayMode: ['original', 'contain', 'cover'].includes(meta?.display_mode)
            ? meta.display_mode
            : 'original',
          category: meta?.media_category || o.customMetadata?.category || (contentType.startsWith('video/') ? 'intro_video' : 'general'),
          versionStatus: ['draft', 'active', 'archived'].includes(meta?.version_status)
            ? meta.version_status
            : o.customMetadata?.versionStatus || 'archived',
          durationSeconds: Number(meta?.duration_seconds ?? o.customMetadata?.durationSeconds ?? 0),
          width: Number(meta?.width ?? o.customMetadata?.width ?? 0),
          height: Number(meta?.height ?? o.customMetadata?.height ?? 0),
          posterUrl: meta?.poster_url || '',
        };
      }),
      cursor: listed.truncated ? listed.cursor : null,
    });
  } catch (error) {
    console.error('Media list failed', error);
    return json({ ok: false, error: 'Không thể tải thư viện.' }, { status: 500 });
  }
}

export async function onRequestPatch(context) {
  const denied = await requireAdminToken(context, 'media.manage');
  if (denied) return denied;
  if (!context.env.MEDIA) return json({ ok: false, error: 'Kho tệp chưa sẵn sàng.' }, { status: 503 });
  try {
    const b = await context.request.json();
    if (!validKey(b.key)) return json({ ok: false, error: 'Tệp không hợp lệ.' }, { status: 400 });
    if (!(await context.env.MEDIA.head(b.key))) return json({ ok: false, error: 'Tệp không tồn tại.' }, { status: 404 });
    await metadataSchema(context);
    const fx = Math.min(100, Math.max(0, Number(b.focalX ?? 50) || 50));
    const fy = Math.min(100, Math.max(0, Number(b.focalY ?? 50) || 50));
    const displayMode = ['original', 'contain', 'cover'].includes(String(b.displayMode || ''))
      ? String(b.displayMode)
      : 'original';
    const mediaCategory = String(b.category || b.mediaCategory || 'general').trim().slice(0, 40);
    const versionStatus = ['draft', 'active', 'archived'].includes(String(b.versionStatus || ''))
      ? String(b.versionStatus)
      : 'archived';
    const durationSeconds = Math.max(0, Math.min(600, Number(b.durationSeconds ?? 0) || 0));
    const width = Math.max(0, Math.min(7680, Math.round(Number(b.width ?? 0) || 0)));
    const height = Math.max(0, Math.min(4320, Math.round(Number(b.height ?? 0) || 0)));
    const posterUrl = String(b.posterUrl || '').trim().slice(0, 500);

    // When activating a new intro video, archive previous active intro videos without deleting them
    if (versionStatus === 'active' && mediaCategory === 'intro_video') {
      await context.env.DB.prepare(
        "UPDATE website_media_metadata SET version_status='archived', updated_at=? WHERE media_category='intro_video' AND version_status='active' AND key<>?"
      )
        .bind(new Date().toISOString(), b.key)
        .run();
    }

    await context.env.DB.prepare(
      `INSERT INTO website_media_metadata(key,alt,caption,credit,source_url,focal_x,focal_y,display_mode,media_category,version_status,duration_seconds,width,height,poster_url,updated_at)
       VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT(key) DO UPDATE SET
         alt=excluded.alt,
         caption=excluded.caption,
         credit=excluded.credit,
         source_url=excluded.source_url,
         focal_x=excluded.focal_x,
         focal_y=excluded.focal_y,
         display_mode=excluded.display_mode,
         media_category=excluded.media_category,
         version_status=excluded.version_status,
         duration_seconds=CASE WHEN excluded.duration_seconds > 0 THEN excluded.duration_seconds ELSE website_media_metadata.duration_seconds END,
         width=CASE WHEN excluded.width > 0 THEN excluded.width ELSE website_media_metadata.width END,
         height=CASE WHEN excluded.height > 0 THEN excluded.height ELSE website_media_metadata.height END,
         poster_url=CASE WHEN excluded.poster_url <> '' THEN excluded.poster_url ELSE website_media_metadata.poster_url END,
         updated_at=excluded.updated_at`
    )
      .bind(
        b.key,
        String(b.alt || '').trim().slice(0, 500),
        String(b.caption || '').trim().slice(0, 2000),
        String(b.credit || '').trim().slice(0, 500),
        String(b.sourceUrl || '').trim().slice(0, 2000),
        fx,
        fy,
        displayMode,
        mediaCategory,
        versionStatus,
        durationSeconds,
        width,
        height,
        posterUrl,
        new Date().toISOString()
      )
      .run();
    return json({ ok: true, key: b.key, versionStatus, category: mediaCategory });
  } catch (error) {
    console.error('Media metadata save failed', error);
    return json({ ok: false, error: 'Không lưu được thông tin tệp.' }, { status: 500 });
  }
}

export async function onRequestDelete(context) {
  const denied = await requireAdminToken(context, 'media.manage');
  if (denied) return denied;
  if (!context.env.MEDIA) return json({ ok: false, error: 'Kho tệp chưa sẵn sàng.' }, { status: 503 });
  try {
    const { key } = await context.request.json();
    if (!validKey(key)) return json({ ok: false, error: 'Tệp không hợp lệ.' }, { status: 400 });
    await metadataSchema(context);

    // Prevent deleting a video/poster marked as active in website_media_metadata
    const metaRow = await context.env.DB.prepare(
      'SELECT version_status, media_category FROM website_media_metadata WHERE key=? LIMIT 1'
    )
      .bind(key)
      .first();
    if (metaRow?.version_status === 'active') {
      return json(
        {
          ok: false,
          error:
            'Video hoặc Poster này đang ở trạng thái Đang hoạt động (Active). Vui lòng kích hoạt phiên bản khác hoặc chuyển sang lưu trữ trước khi xóa.',
        },
        { status: 409 }
      );
    }

    const table = await context.env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='website_cms_documents'"
    ).first();
    if (table) {
      const used = await context.env.DB.prepare(
        'SELECT doc_id FROM website_cms_documents WHERE instr(data_json,?)>0 LIMIT 1'
      )
        .bind(key)
        .first();
      if (used) {
        return json(
          {
            ok: false,
            error:
              'Tệp đang được dùng trong nội dung website hoặc cấu hình Intro đang hoạt động. Hãy thay thế ở trang/cấu hình trước khi xóa.',
          },
          { status: 409 }
        );
      }
    }
    await context.env.MEDIA.delete(key);
    await context.env.DB.prepare('DELETE FROM website_media_metadata WHERE key=?').bind(key).run();
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: 'Không thể xóa tệp.' }, { status: 500 });
  }
}
