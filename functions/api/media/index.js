import { requireAdminToken, json } from '../../_auth.js';

export async function onRequestGet(context) {
  const denied = requireAdminToken(context);
  if (denied) return denied;
  if (!context.env.MEDIA) return json({ ok: false, error: 'R2 binding MEDIA chưa sẵn sàng.' }, { status: 503 });
  const url = new URL(context.request.url);
  const cursor = url.searchParams.get('cursor') || undefined;
  const listed = await context.env.MEDIA.list({ prefix: 'website/', limit: 100, cursor });
  return json({
    ok: true,
    items: listed.objects.map((o) => ({ key: o.key, url: `/media/${o.key}`, size: o.size, uploaded: o.uploaded })),
    cursor: listed.truncated ? listed.cursor : null,
  });
}

export async function onRequestDelete(context) {
  const denied = requireAdminToken(context);
  if (denied) return denied;
  const { key } = await context.request.json().catch(() => ({}));
  if (!key || typeof key !== 'string' || !key.startsWith('website/')) return json({ ok: false, error: 'Key không hợp lệ.' }, { status: 400 });
  await context.env.MEDIA.delete(key);
  return json({ ok: true });
}
