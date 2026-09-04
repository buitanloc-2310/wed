import { APP } from '../config.js';
import { parseCookies } from '../utils/cookies.js';
import { sha256 } from '../utils/crypto.js';

const ADMIN_ONLY = new Set(['settings','languages','menus','portals','certificates']);
const SUPER_ONLY = new Set(['admins','issuer_keys']);
const SENSITIVE_READ = new Set(['audit_log']);
const REVIEWER_EDIT = new Set(['pages','posts','programs','classes','activities','albums','documents','forms','ui_strings']);
const EDITOR_BLOCKED = new Set(['settings','languages','menus','portals','certificates','admins','issuer_keys','audit_log','forms']);

export async function currentAdmin(request, env) {
  const token = parseCookies(request)[APP.sessionCookie];
  if (!token) return null;
  const hash = await sha256(token);
  const row = await env.DB.prepare(`
    SELECT a.id,a.email,a.name,a.role,s.csrf_token,s.expires_at
    FROM site_sessions s
    JOIN site_admins a ON a.id=s.admin_id
    WHERE s.token_hash=? AND s.expires_at>datetime('now') AND a.active=1
  `).bind(hash).first();
  if (row) env.DB.prepare('UPDATE site_sessions SET last_seen_at=CURRENT_TIMESTAMP WHERE token_hash=?').bind(hash).run().catch(() => {});
  return row || null;
}

export function can(role, action) {
  if (role === 'SUPER_ADMIN') return true;
  if (role === 'ADMIN') return action !== 'manage_super_admin';
  if (role === 'EDITOR') return ['read','create','update','upload'].includes(action);
  if (role === 'REVIEWER') return ['read','update','publish'].includes(action);
  return false;
}

export function canResource(role, name, action) {
  if (role === 'SUPER_ADMIN') return true;
  if (SUPER_ONLY.has(name)) return false;

  if (role === 'ADMIN') return true;

  if (role === 'EDITOR') {
    if (SENSITIVE_READ.has(name)) return false;
    if (action === 'read') return !EDITOR_BLOCKED.has(name);
    if (EDITOR_BLOCKED.has(name)) return false;
    return ['create','update','upload'].includes(action);
  }

  if (role === 'REVIEWER') {
    if (SUPER_ONLY.has(name) || ADMIN_ONLY.has(name) || SENSITIVE_READ.has(name)) return false;
    if (action === 'read') return true;
    if (action === 'publish' || action === 'update') return REVIEWER_EDIT.has(name);
    return false;
  }

  return false;
}

export function csrfOk(request, admin) {
  if (['GET','HEAD','OPTIONS'].includes(request.method)) return true;
  return !!admin && request.headers.get('x-csrf-token') === admin.csrf_token;
}
