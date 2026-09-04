import { json } from '../utils/response.js';
import { currentAdmin, csrfOk, canResource } from '../middleware/auth.js';
import { uploadMedia } from '../services/media.js';
import { audit } from '../services/audit.js';

export async function mediaRoute(request, env, url) {
  if (url.pathname.startsWith('/media/')) {
    const key = decodeURIComponent(url.pathname.slice(7));
    if (!key || key.includes('..')) return new Response('Not found', { status: 404 });
    const row = await env.DB.prepare('SELECT mime_type,public FROM site_media WHERE object_key=?').bind(key).first();
    if (!row || !row.public) return new Response('Not found', { status: 404 });
    const obj = await env.MEDIA.get(key);
    if (!obj) return new Response('Not found', { status: 404 });
    const headers = new Headers({
      'content-type': obj.httpMetadata?.contentType || row.mime_type,
      'cache-control': 'public,max-age=86400',
      'x-content-type-options': 'nosniff'
    });
    if (obj.httpEtag) headers.set('etag', obj.httpEtag);
    return new Response(obj.body, { headers });
  }

  if (url.pathname === '/api/admin/media/upload' && request.method === 'POST') {
    const admin = await currentAdmin(request, env);
    if (!admin) return json({ error: 'UNAUTHORIZED' }, 401);
    if (!csrfOk(request, admin)) return json({ error: 'CSRF' }, 403);
    if (!canResource(admin.role, 'media', 'upload')) return json({ error: 'FORBIDDEN' }, 403);
    const result = await uploadMedia(request, env, admin);
    if (result.error) return json({ error: result.error }, result.status);
    await audit(env, request, admin, 'UPLOAD', 'media', result.id, { key: result.key, size_bytes: result.size_bytes });
    return json(result, 201);
  }

  return null;
}
