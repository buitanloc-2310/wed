import { randomToken, sha256 } from '../utils/crypto.js';

export function certificateCode() {
  return `SKYFIRST-${new Date().getUTCFullYear()}-${randomToken(8).toUpperCase()}`;
}

export async function issuerFromBearer(env, token) {
  if (!token) return null;
  const hash = await sha256(token);
  const row = await env.DB.prepare('SELECT * FROM issuer_api_keys WHERE key_hash=? AND active=1').bind(hash).first();
  if (row) await env.DB.prepare('UPDATE issuer_api_keys SET last_used_at=CURRENT_TIMESTAMP WHERE id=?').bind(row.id).run();
  return row;
}

export async function createIssuerKey(env, admin, issuerName) {
  const raw = 'skf_' + randomToken(36);
  const hash = await sha256(raw);
  const prefix = raw.slice(0, 12);
  const result = await env.DB.prepare(
    'INSERT INTO issuer_api_keys(issuer_name,key_prefix,key_hash,created_by) VALUES(?,?,?,?)'
  ).bind(issuerName, prefix, hash, admin.id).run();
  return { id: result.meta.last_row_id, key: raw, prefix };
}

export async function issueCertificate(env, data, issuer) {
  let lastError;
  for (let attempt = 0; attempt < 4; attempt++) {
    const code = certificateCode();
    const token = randomToken(32);
    try {
      const result = await env.DB.prepare(`
        INSERT INTO site_certificates(
          certificate_code,verification_token,recipient_name,title,issuer_unit,program_name,
          role_recognition,issue_date,valid_until,issuing_system,status,public_pdf_url,issuer_key_id
        ) VALUES(?,?,?,?,?,?,?,?,?,?, 'pending_qr',?,?)
      `).bind(
        code, token, data.recipient_name, data.title,
        data.issuer_unit || issuer.issuer_name,
        data.program_name || null,
        data.role_recognition || null,
        data.issue_date,
        data.valid_until || null,
        // The source of a record belongs to the issuer key, never to a value
        // supplied by another website or app. This keeps central verification
        // at skyfirst.io.vn trustworthy across the whole Sky First system.
        issuer.issuer_name,
        data.public_pdf_url || null,
        issuer.id
      ).run();
      return {
        id: result.meta.last_row_id,
        certificate_code: code,
        verification_token: token,
        verification_url: `https://skyfirst.io.vn/tra-cuu/${encodeURIComponent(token)}`,
        status: 'pending_qr'
      };
    } catch (error) {
      lastError = error;
      if (!/UNIQUE/i.test(String(error?.message || error))) throw error;
    }
  }
  throw lastError || new Error('CERTIFICATE_CODE_GENERATION_FAILED');
}
