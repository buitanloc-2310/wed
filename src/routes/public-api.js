import { json } from '../utils/response.js';
import { bodyJson } from '../utils/request.js';
import { rateLimit } from '../middleware/rate-limit.js';
import { publicContext } from '../services/public-context.js';
import { verifyCertificate } from '../repositories/certificates.js';

const REQUIRED_TABLES = [
  'site_settings',
  'site_languages',
  'site_menus',
  'site_portals',
  'pages',
  'site_ui_strings'
];

async function databaseHealth(env) {
  if (!env.DB) {
    return { ok: false, database: 'binding_missing', missing: REQUIRED_TABLES };
  }
  try {
    const marks = REQUIRED_TABLES.map(() => '?').join(',');
    const result = await env.DB.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name IN (${marks})`
    ).bind(...REQUIRED_TABLES).all();
    const found = new Set((result.results || []).map(row => row.name));
    const missing = REQUIRED_TABLES.filter(name => !found.has(name));
    return {
      ok: missing.length === 0,
      database: missing.length ? 'migration_required' : 'ready',
      missing
    };
  } catch {
    return { ok: false, database: 'unavailable', missing: [] };
  }
}

export async function publicApi(request, env, url) {
  if (url.pathname === '/api/health') {
    return json({ ok: true, service: 'sky-first-network-website', time: new Date().toISOString() });
  }

  if (url.pathname === '/api/health/db') {
    const status = await databaseHealth(env);
    return json(status, status.ok ? 200 : 503);
  }

  if (url.pathname === '/api/public/bootstrap' && request.method === 'GET') {
    const lang = url.searchParams.get('lang') || 'vi';
    return json(await publicContext(env, lang));
  }

  if (url.pathname === '/api/certificates/verify' && request.method === 'GET') {
    const q = (url.searchParams.get('q') || '').trim();
    const c = await verifyCertificate(env, q);
    return json({ found: !!c, certificate: c });
  }

  if (url.pathname === '/api/forms' && request.method === 'POST') {
    if (!await rateLimit(request, env, 'forms', { limit: 8, windowSeconds: 300 })) {
      return json({ error: 'RATE_LIMIT' }, 429);
    }
    const d = await bodyJson(request);
    if (String(d.website || '').trim()) {
      return json({ ok: true, message: 'Sky First đã tiếp nhận thông tin.' }, 201);
    }
    const allowed = new Set(['core_team', 'volunteer', 'learner', 'cooperation', 'contact']);
    if (!allowed.has(d.form_type) || !String(d.name || '').trim() || !d.consent) {
      return json({ error: 'INVALID_INPUT' }, 400);
    }
    const vals = [
      d.form_type,
      String(d.name).trim().slice(0, 120),
      String(d.email || '').trim().slice(0, 160) || null,
      String(d.phone || '').trim().slice(0, 40) || null,
      String(d.organization || '').trim().slice(0, 180) || null,
      d.program_id || null,
      String(d.message || '').trim().slice(0, 3000) || null,
      1
    ];
    await env.DB.prepare(
      'INSERT INTO site_forms(form_type,name,email,phone,organization,program_id,message,consent) VALUES(?,?,?,?,?,?,?,?)'
    ).bind(...vals).run();
    return json({ ok: true, message: 'Sky First đã tiếp nhận thông tin.' }, 201);
  }

  return null;
}
