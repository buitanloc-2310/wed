import { requireAdminToken, json } from '../../_auth.js';

function clean(value, max) {
  return String(value || '').trim().slice(0, max);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function makeCode() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `SFN-${stamp}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

export async function onRequestPost(context) {
  const body = await context.request.json().catch(() => ({}));
  const programId = clean(body.programId, 120);
  const programTitle = clean(body.programTitle, 240);
  const fullName = clean(body.fullName, 120);
  const email = clean(body.email, 180);
  const phone = clean(body.phone, 40);
  const organization = clean(body.organization, 180);
  const birthYear = clean(body.birthYear, 8);
  const portfolioUrl = clean(body.portfolioUrl, 500);
  const motivation = clean(body.motivation, 4000);
  const consent = body.consent === true ? 1 : 0;

  if (!programId || !programTitle || !fullName || !email || !phone || !organization || !motivation || !consent) {
    return json({ ok: false, error: 'Vui lòng nhập đầy đủ thông tin bắt buộc và xác nhận cam kết.' }, { status: 400 });
  }
  if (!validEmail(email)) return json({ ok: false, error: 'Email không hợp lệ.' }, { status: 400 });
  if (birthYear && !/^\d{4}$/.test(birthYear)) return json({ ok: false, error: 'Năm sinh không hợp lệ.' }, { status: 400 });
  if (portfolioUrl && !/^https?:\/\//i.test(portfolioUrl)) return json({ ok: false, error: 'Liên kết hồ sơ phải bắt đầu bằng http:// hoặc https://.' }, { status: 400 });

  const id = crypto.randomUUID();
  const applicationCode = makeCode();
  await context.env.DB.prepare(`
    INSERT INTO website_registrations
      (id, application_code, program_id, program_title, full_name, email, phone, organization, birth_year, portfolio_url, motivation, consent, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', datetime('now'))
  `).bind(id, applicationCode, programId, programTitle, fullName, email, phone, organization, birthYear, portfolioUrl, motivation, consent).run();

  return json({ ok: true, applicationCode, message: 'Hồ sơ đăng ký đã được tiếp nhận.' });
}

export async function onRequestGet(context) {
  const denied = requireAdminToken(context); if (denied) return denied;
  const rows = await context.env.DB.prepare(`
    SELECT id, application_code, program_id, program_title, full_name, email, phone, organization,
           birth_year, portfolio_url, motivation, consent, status, created_at
    FROM website_registrations
    ORDER BY created_at DESC
    LIMIT 500
  `).all();
  return json({ ok: true, items: rows.results || [] });
}

export async function onRequestPatch(context) {
  const denied = requireAdminToken(context); if (denied) return denied;
  const body = await context.request.json().catch(() => ({}));
  const id = clean(body.id, 80);
  const status = clean(body.status, 30);
  if (!id || !['new', 'reviewing', 'accepted', 'rejected', 'closed'].includes(status)) {
    return json({ ok: false, error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }
  await context.env.DB.prepare('UPDATE website_registrations SET status = ? WHERE id = ?').bind(status, id).run();
  return json({ ok: true });
}

export async function onRequestDelete(context) {
  const denied = requireAdminToken(context); if (denied) return denied;
  const body = await context.request.json().catch(() => ({}));
  const id = clean(body.id, 80);
  if (!id) return json({ ok: false, error: 'Thiếu id.' }, { status: 400 });
  await context.env.DB.prepare('DELETE FROM website_registrations WHERE id = ?').bind(id).run();
  return json({ ok: true });
}
