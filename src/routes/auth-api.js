import { APP } from '../config.js';
import { json } from '../utils/response.js';
import { bodyJson } from '../utils/request.js';
import { adminCount, adminByEmail } from '../repositories/admins.js';
import { randomToken, passwordHash, sha256 } from '../utils/crypto.js';
import { sessionCookie, clearCookie, parseCookies } from '../utils/cookies.js';
import { currentAdmin, csrfOk } from '../middleware/auth.js';
import { isEmail } from '../utils/validation.js';
import { rateLimit } from '../middleware/rate-limit.js';
import { audit } from '../services/audit.js';

export async function authApi(request, env, url) {
  if (url.pathname === '/api/admin/session' && request.method === 'GET') {
    const [count, admin] = await Promise.all([adminCount(env), currentAdmin(request, env)]);
    return json({
      setup_required: count === 0,
      authenticated: !!admin,
      admin: admin ? { id: admin.id, email: admin.email, name: admin.name, role: admin.role } : null,
      csrf: admin?.csrf_token || null
    });
  }

  if (url.pathname === '/api/admin/setup' && request.method === 'POST') {
    if (!await rateLimit(request, env, 'admin-setup', { limit: 5, windowSeconds: 600 })) return json({ error: 'RATE_LIMIT' }, 429);
    const data = await bodyJson(request);
    if (!isEmail(data.email) || String(data.password || '').length < 12 || !String(data.name || '').trim()) {
      return json({ error: 'INVALID_INPUT' }, 400);
    }

    const salt = randomToken(16);
    const hash = await passwordHash(data.password, salt);
    try {
      const r = await env.DB.prepare(`
        INSERT INTO site_admins(email,name,role,password_hash,password_salt)
        SELECT ?,?,'SUPER_ADMIN',?,?
        WHERE NOT EXISTS (SELECT 1 FROM site_admins LIMIT 1)
      `).bind(data.email.toLowerCase(), String(data.name).trim(), hash, salt).run();
      if (!Number(r.meta?.changes || 0)) return json({ error: 'SETUP_LOCKED' }, 409);
      await audit(env, request, { id: r.meta.last_row_id }, 'SETUP', 'admin', r.meta.last_row_id);
      return json({ ok: true }, 201);
    } catch (e) {
      return json({ error: 'SETUP_LOCKED', detail: String(e.message || e) }, 409);
    }
  }

  if (url.pathname === '/api/admin/login' && request.method === 'POST') {
    if (!await rateLimit(request, env, 'admin-login', { limit: 8, windowSeconds: 300 })) return json({ error: 'RATE_LIMIT' }, 429);
    const data = await bodyJson(request);
    const admin = await adminByEmail(env, String(data.email || '').toLowerCase());
    if (!admin || !admin.active || await passwordHash(data.password || '', admin.password_salt) !== admin.password_hash) {
      return json({ error: 'INVALID_CREDENTIALS' }, 401);
    }

    const raw = randomToken(36);
    const tokenHash = await sha256(raw);
    const csrf = randomToken(24);
    const exp = new Date(Date.now() + APP.sessionHours * 3600_000).toISOString();
    await env.DB.batch([
      env.DB.prepare('INSERT INTO site_sessions(token_hash,csrf_token,admin_id,expires_at) VALUES(?,?,?,?)').bind(tokenHash, csrf, admin.id, exp),
      env.DB.prepare('UPDATE site_admins SET last_login_at=CURRENT_TIMESTAMP WHERE id=?').bind(admin.id)
    ]);
    await audit(env, request, admin, 'LOGIN', 'admin', admin.id);
    return json({
      ok: true,
      csrf,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role }
    }, 200, { 'set-cookie': sessionCookie(APP.sessionCookie, raw, APP.sessionHours * 3600) });
  }

  if (url.pathname === '/api/admin/change-password' && request.method === 'POST') {
    const admin = await currentAdmin(request, env);
    if (!admin) return json({ error: 'UNAUTHORIZED' }, 401);
    if (!csrfOk(request, admin)) return json({ error: 'CSRF' }, 403);
    if (!await rateLimit(request, env, 'admin-password', { limit: 6, windowSeconds: 600 })) return json({ error: 'RATE_LIMIT' }, 429);

    const data = await bodyJson(request);
    if (String(data.new_password || '').length < 12) return json({ error: 'PASSWORD_TOO_SHORT' }, 400);
    const row = await env.DB.prepare('SELECT password_hash,password_salt FROM site_admins WHERE id=? AND active=1').bind(admin.id).first();
    if (!row || await passwordHash(data.current_password || '', row.password_salt) !== row.password_hash) {
      return json({ error: 'INVALID_CURRENT_PASSWORD' }, 401);
    }

    const salt = randomToken(16);
    const hash = await passwordHash(data.new_password, salt);
    const rawSession = parseCookies(request)[APP.sessionCookie];
    const currentHash = rawSession ? await sha256(rawSession) : '';
    await env.DB.batch([
      env.DB.prepare('UPDATE site_admins SET password_hash=?,password_salt=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(hash, salt, admin.id),
      env.DB.prepare('DELETE FROM site_sessions WHERE admin_id=? AND token_hash<>?').bind(admin.id, currentHash)
    ]);
    await audit(env, request, admin, 'CHANGE_PASSWORD', 'admin', admin.id);
    return json({ ok: true });
  }

  if (url.pathname === '/api/admin/logout' && request.method === 'POST') {
    const admin = await currentAdmin(request, env);
    if (admin && !csrfOk(request, admin)) return json({ error: 'CSRF' }, 403);
    const token = parseCookies(request)[APP.sessionCookie];
    if (token) {
      const hash = await sha256(token);
      await env.DB.prepare('DELETE FROM site_sessions WHERE token_hash=?').bind(hash).run();
    }
    return json({ ok: true }, 200, { 'set-cookie': clearCookie(APP.sessionCookie) });
  }

  return null;
}
