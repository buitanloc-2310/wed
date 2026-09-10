import { requireAdminToken, json } from '../../_auth.js';

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function safeName(name = 'image') {
  const dot = name.lastIndexOf('.');
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : '';
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'image';
  return `${base.slice(0, 70)}${ext.slice(0, 8)}`;
}

export async function onRequestPost(context) {
  const denied = requireAdminToken(context);
  if (denied) return denied;
  if (!context.env.MEDIA) return json({ ok: false, error: 'R2 binding MEDIA chưa sẵn sàng.' }, { status: 503 });

  const form = await context.request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return json({ ok: false, error: 'Chưa chọn file ảnh.' }, { status: 400 });
  if (!ALLOWED.has(file.type)) return json({ ok: false, error: 'Chỉ hỗ trợ JPG, PNG, WebP hoặc GIF.' }, { status: 400 });
  if (file.size > MAX_BYTES) return json({ ok: false, error: 'Ảnh vượt quá 8 MB.' }, { status: 400 });

  const now = new Date();
  const ym = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
  const id = crypto.randomUUID().slice(0, 8);
  const key = `website/${ym}/${id}-${safeName(file.name)}`;
  await context.env.MEDIA.put(key, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
    customMetadata: { originalName: file.name, uploadedAt: now.toISOString() },
  });
  return json({ ok: true, key, url: `/media/${key}`, name: file.name, size: file.size, type: file.type });
}
