import { json } from '../utils/response.js';
import { bodyJson } from '../utils/request.js';
import { currentAdmin, csrfOk, canResource } from '../middleware/auth.js';
import { resource, RESOURCES } from '../admin/resources.js';
import { pick, isEmail, asBool } from '../utils/validation.js';
import { updateStatement } from '../utils/sql.js';
import { audit } from '../services/audit.js';
import { createIssuerKey } from '../services/certificates.js';
import { randomToken, passwordHash } from '../utils/crypto.js';
import { sanitizeHtml } from '../utils/sanitize-html.js';
import { ROLES } from '../config.js';

const BOOL_FIELDS = new Set(['public','visible','new_tab','enabled','is_default','show_footer','active','consent']);
const HTML_FIELDS = new Set(['body_html','description','summary','excerpt','bio','objective']);

function cleanForWrite(name, data, admin) {
  const meta = resource(name);
  const out = pick(data, meta.fields);

  for (const k of HTML_FIELDS) {
    if (k in out) out[k] = sanitizeHtml(out[k]);
  }
  for (const k of Object.keys(out)) {
    if (BOOL_FIELDS.has(k)) out[k] = asBool(out[k]);
  }

  if (name === 'pages' || name === 'posts') {
    out.updated_by = admin.id;
    if (out.status === 'published') {
      const scheduled = out.scheduled_at ? Date.parse(out.scheduled_at) : NaN;
      if (Number.isFinite(scheduled) && scheduled > Date.now()) {
        if (!out.published_at) out.published_at = new Date(scheduled).toISOString();
      } else if (!out.published_at) {
        out.published_at = new Date().toISOString();
      }
    }
  }

  return out;
}

function capabilities(admin, name, meta) {
  return {
    read: canResource(admin.role, name, 'read'),
    create: (name === 'issuer_keys' || (!meta.readOnly && !meta.readonlyCreate)) && canResource(admin.role, name, 'create'),
    update: !meta.readOnly && canResource(admin.role, name, 'update'),
    publish: canResource(admin.role, name, 'publish'),
    delete: !meta.readOnly && !meta.noDelete && canResource(admin.role, name, 'delete'),
    upload: name === 'media' && canResource(admin.role, name, 'upload')
  };
}

function isPublishAttempt(name, raw) {
  return (name === 'pages' || name === 'posts' || name === 'ui_strings') && raw.status === 'published';
}

export async function adminApi(request, env, url) {
  if (!url.pathname.startsWith('/api/admin/')) return null;
  if (['/api/admin/session','/api/admin/setup','/api/admin/login','/api/admin/logout','/api/admin/change-password','/api/admin/media/upload'].includes(url.pathname)) return null;

  const admin = await currentAdmin(request, env);
  if (!admin) return json({ error: 'UNAUTHORIZED' }, 401);
  if (!csrfOk(request, admin)) return json({ error: 'CSRF' }, 403);

  if (url.pathname === '/api/admin/meta') {
    return json({
      resources: Object.fromEntries(Object.entries(RESOURCES).map(([name, meta]) => [name, {
        label: meta.label,
        fields: meta.fields,
        idField: meta.idField || 'id',
        readOnly: !!meta.readOnly,
        readonlyCreate: !!meta.readonlyCreate,
        noDelete: !!meta.noDelete,
        capabilities: capabilities(admin, name, meta)
      }]))
    });
  }

  if (url.pathname === '/api/admin/dashboard') {
    const countTables = [
      ['pages','pages'],['posts','posts'],['programs','programs'],['classes','classes'],
      ['activities','activities'],['forms','site_forms'],['certificates','site_certificates'],['media','site_media']
    ];
    const rows = await Promise.all(countTables.map(([, table]) => env.DB.prepare(`SELECT COUNT(*) c FROM ${table}`).first()));
    return json({
      counts: Object.fromEntries(countTables.map(([key], i) => [key, Number(rows[i].c || 0)])),
      admin: { name: admin.name, role: admin.role }
    });
  }

  if (url.pathname === '/api/admin/issuer-keys' && request.method === 'POST') {
    if (!canResource(admin.role, 'issuer_keys', 'create')) return json({ error: 'FORBIDDEN' }, 403);
    const data = await bodyJson(request);
    if (!String(data.issuer_name || '').trim()) return json({ error: 'INVALID_INPUT' }, 400);
    const key = await createIssuerKey(env, admin, String(data.issuer_name).trim().slice(0, 160));
    await audit(env, request, admin, 'CREATE_ISSUER_KEY', 'issuer_api_keys', key.id, { issuer_name: data.issuer_name });
    return json({ ...key, warning: 'Khóa chỉ hiển thị một lần. Hãy lưu ở nơi an toàn.' }, 201);
  }

  if (url.pathname === '/api/admin/admins' && request.method === 'POST') {
    if (!canResource(admin.role, 'admins', 'create')) return json({ error: 'FORBIDDEN' }, 403);
    const data = await bodyJson(request);
    const role = ROLES.includes(data.role) ? data.role : 'EDITOR';
    if (!isEmail(data.email) || String(data.password || '').length < 12 || !String(data.name || '').trim()) {
      return json({ error: 'INVALID_INPUT' }, 400);
    }
    const salt = randomToken(16);
    const hash = await passwordHash(data.password, salt);
    try {
      const r = await env.DB.prepare(
        'INSERT INTO site_admins(email,name,role,password_hash,password_salt,active) VALUES(?,?,?,?,?,?)'
      ).bind(String(data.email).toLowerCase(), String(data.name).trim(), role, hash, salt, data.active === false ? 0 : 1).run();
      await audit(env, request, admin, 'CREATE', 'admins', r.meta.last_row_id, { email: data.email, role });
      return json({ ok: true, id: r.meta.last_row_id }, 201);
    } catch (e) {
      return json({ error: 'WRITE_FAILED', detail: String(e.message || e) }, 409);
    }
  }

  const match = url.pathname.match(/^\/api\/admin\/resources\/([a-z_]+)(?:\/([^/]+))?$/);
  if (!match) return json({ error: 'NOT_FOUND' }, 404);

  const name = match[1];
  const id = match[2];
  const meta = resource(name);
  if (!meta) return json({ error: 'RESOURCE_NOT_FOUND' }, 404);
  const cap = capabilities(admin, name, meta);
  const idField = meta.idField || 'id';

  if (request.method === 'GET') {
    if (!cap.read) return json({ error: 'FORBIDDEN' }, 403);
    const select = meta.select || '*';
    if (id) {
      const row = await env.DB.prepare(`SELECT ${select} FROM ${meta.table} WHERE ${idField}=?`).bind(decodeURIComponent(id)).first();
      return row ? json(row) : json({ error: 'NOT_FOUND' }, 404);
    }
    const order = meta.orderBy || (idField === 'id' ? 'id DESC' : 'sort_order ASC');
    const rows = (await env.DB.prepare(`SELECT ${select} FROM ${meta.table} ORDER BY ${order} LIMIT 500`).all()).results;
    return json({ results: rows });
  }

  if (meta.readOnly) return json({ error: 'READ_ONLY' }, 405);

  if (request.method === 'POST' && !id) {
    if (meta.readonlyCreate) return json({ error: 'CREATE_NOT_SUPPORTED_HERE' }, 405);
    if (!cap.create) return json({ error: 'FORBIDDEN' }, 403);
    const raw = await bodyJson(request);
    if (isPublishAttempt(name, raw) && !cap.publish) return json({ error: 'PUBLISH_FORBIDDEN' }, 403);
    const data = cleanForWrite(name, raw, admin);
    if (!Object.keys(data).length) return json({ error: 'NO_FIELDS' }, 400);
    if (name === 'pages' || name === 'posts') {
      data.translation_group = data.translation_group || `${name}:${crypto.randomUUID()}`;
      data.created_by = admin.id;
    }
    const keys = Object.keys(data);
    const sql = `INSERT INTO ${meta.table}(${keys.join(',')}) VALUES(${keys.map(() => '?').join(',')})`;
    try {
      const r = await env.DB.prepare(sql).bind(...keys.map(k => data[k])).run();
      await audit(env, request, admin, 'CREATE', name, r.meta.last_row_id, data);
      return json({ ok: true, id: r.meta.last_row_id }, 201);
    } catch (e) {
      return json({ error: 'WRITE_FAILED', detail: String(e.message || e) }, 409);
    }
  }

  if (id && request.method === 'PATCH') {
    if (!cap.update) return json({ error: 'FORBIDDEN' }, 403);
    const raw = await bodyJson(request);
    if (isPublishAttempt(name, raw) && !cap.publish) return json({ error: 'PUBLISH_FORBIDDEN' }, 403);
    const data = cleanForWrite(name, raw, admin);
    if (!Object.keys(data).length) return json({ error: 'NO_FIELDS' }, 400);

    if (name === 'languages' && data.is_default === 1) {
      if (data.enabled === 0) return json({ error: 'DEFAULT_LANGUAGE_MUST_BE_ENABLED' }, 409);
      await env.DB.prepare('UPDATE site_languages SET is_default=0,updated_at=CURRENT_TIMESTAMP').run();
    }
    if (name === 'languages' && data.enabled === 0) {
      const current = await env.DB.prepare('SELECT is_default FROM site_languages WHERE code=?').bind(decodeURIComponent(id)).first();
      if (current?.is_default) return json({ error: 'CANNOT_DISABLE_DEFAULT_LANGUAGE' }, 409);
    }
    if (name === 'admins' && String(id) === String(admin.id) && data.active === 0) {
      return json({ error: 'CANNOT_DISABLE_SELF' }, 409);
    }
    if (name === 'admins' && data.role && !ROLES.includes(data.role)) {
      return json({ error: 'INVALID_ROLE' }, 400);
    }

    const statement = updateStatement(meta.table, data, idField);
    try {
      await env.DB.prepare(statement.sql).bind(...statement.values, decodeURIComponent(id)).run();
      await audit(env, request, admin, 'UPDATE', name, id, data);
      return json({ ok: true });
    } catch (e) {
      return json({ error: 'WRITE_FAILED', detail: String(e.message || e) }, 409);
    }
  }

  if (id && request.method === 'DELETE') {
    if (!cap.delete) return json({ error: 'FORBIDDEN' }, 403);
    if (name === 'languages') return json({ error: 'LANGUAGE_DELETE_DISABLED' }, 409);
    if (name === 'admins' && String(id) === String(admin.id)) return json({ error: 'CANNOT_DISABLE_SELF' }, 409);

    if (name === 'certificates') {
      await env.DB.prepare("UPDATE site_certificates SET status='revoked',revoked_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(id).run();
    } else if (name === 'admins') {
      await env.DB.prepare('UPDATE site_admins SET active=0,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(id).run();
    } else if (name === 'media') {
      await env.DB.prepare('UPDATE site_media SET public=0,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(id).run();
    } else if (['pages','posts','programs','classes','activities','albums','documents'].includes(name)) {
      await env.DB.prepare(`UPDATE ${meta.table} SET status='archived',updated_at=CURRENT_TIMESTAMP WHERE ${idField}=?`).bind(decodeURIComponent(id)).run();
    } else {
      await env.DB.prepare(`DELETE FROM ${meta.table} WHERE ${idField}=?`).bind(decodeURIComponent(id)).run();
    }
    await audit(env, request, admin, 'DELETE_OR_ARCHIVE', name, id);
    return json({ ok: true });
  }

  return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
}
