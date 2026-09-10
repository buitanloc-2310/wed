import { requireAdminToken, json } from '../../_auth.js';
function clean(v, max) { return String(v || '').trim().slice(0, max); }

export async function onRequestPost(context) {
  const body = await context.request.json().catch(() => ({}));
  const name = clean(body.name, 100), email = clean(body.email, 180), message = clean(body.message, 4000), topic = clean(body.topic || 'Liên hệ chung', 120);
  if (!name || !email || !message) return json({ ok: false, error: 'Vui lòng nhập đầy đủ thông tin.' }, { status: 400 });
  const id = crypto.randomUUID();
  await context.env.DB.prepare("INSERT INTO website_contacts (id, name, email, topic, message, status, created_at) VALUES (?, ?, ?, ?, ?, 'new', datetime('now'))").bind(id, name, email, topic, message).run();
  return json({ ok: true, message: 'Thông tin của bạn đã được tiếp nhận.' });
}

export async function onRequestGet(context) {
  const denied = requireAdminToken(context); if (denied) return denied;
  const rows = await context.env.DB.prepare('SELECT id, name, email, topic, message, status, created_at FROM website_contacts ORDER BY created_at DESC LIMIT 300').all();
  return json({ ok: true, items: rows.results || [] });
}

export async function onRequestPatch(context) {
  const denied = requireAdminToken(context); if (denied) return denied;
  const body = await context.request.json().catch(() => ({}));
  const id = clean(body.id, 80), status = clean(body.status, 20);
  if (!id || !['new','reviewed','closed'].includes(status)) return json({ ok: false, error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  await context.env.DB.prepare('UPDATE website_contacts SET status = ? WHERE id = ?').bind(status, id).run();
  return json({ ok: true });
}

export async function onRequestDelete(context) {
  const denied = requireAdminToken(context); if (denied) return denied;
  const body = await context.request.json().catch(() => ({}));
  const id = clean(body.id, 80); if (!id) return json({ ok: false, error: 'Thiếu id.' }, { status: 400 });
  await context.env.DB.prepare('DELETE FROM website_contacts WHERE id = ?').bind(id).run();
  return json({ ok: true });
}
