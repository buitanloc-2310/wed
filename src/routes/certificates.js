import { json } from '../utils/response.js';
import { bearer, bodyJson } from '../utils/request.js';
import { issuerFromBearer, issueCertificate } from '../services/certificates.js';
import { rateLimit } from '../middleware/rate-limit.js';

export async function certificateApi(request, env, url) {
  if (url.pathname === '/api/certificates/issue' && request.method === 'POST') {
    if (!await rateLimit(request, env, 'cert-issue', { limit: 60, windowSeconds: 60 })) return json({ error: 'RATE_LIMIT' }, 429);
    const issuer = await issuerFromBearer(env, bearer(request));
    if (!issuer) return json({ error: 'UNAUTHORIZED_ISSUER' }, 401);
    const data = await bodyJson(request);
    if (!String(data.recipient_name || '').trim() || !String(data.title || '').trim() || !data.issue_date) {
      return json({ error: 'INVALID_INPUT' }, 400);
    }
    const issued = await issueCertificate(env, {
      ...data,
      recipient_name: String(data.recipient_name).trim().slice(0, 180),
      title: String(data.title).trim().slice(0, 220)
    }, issuer);
    return json(issued, 201);
  }

  const match = url.pathname.match(/^\/api\/certificates\/([^/]+)\/finalize$/);
  if (match && request.method === 'POST') {
    const issuer = await issuerFromBearer(env, bearer(request));
    if (!issuer) return json({ error: 'UNAUTHORIZED_ISSUER' }, 401);
    const data = await bodyJson(request);
    if (!data.qr_url) return json({ error: 'QR_REQUIRED' }, 400);
    const row = await env.DB.prepare(
      'SELECT id,status,issuer_key_id FROM site_certificates WHERE certificate_code=?'
    ).bind(decodeURIComponent(match[1])).first();
    if (!row) return json({ error: 'NOT_FOUND' }, 404);
    if (row.status === 'revoked') return json({ error: 'REVOKED' }, 409);
    if (row.issuer_key_id && Number(row.issuer_key_id) !== Number(issuer.id)) return json({ error: 'FORBIDDEN_ISSUER' }, 403);
    await env.DB.prepare(
      "UPDATE site_certificates SET qr_url=?,status='valid',updated_at=CURRENT_TIMESTAMP WHERE id=?"
    ).bind(String(data.qr_url).slice(0, 1000), row.id).run();
    return json({ ok: true, status: 'valid' });
  }

  return null;
}
