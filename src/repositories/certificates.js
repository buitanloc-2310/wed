export async function verifyCertificate(env, q) {
  if (!q) return null;
  return await env.DB.prepare(`
    SELECT
      certificate_code,verification_token,recipient_name,title,issuer_unit,program_name,
      role_recognition,issue_date,valid_until,issuing_system,
      CASE
        WHEN status='valid' AND valid_until IS NOT NULL AND date(valid_until)<date('now') THEN 'expired'
        ELSE status
      END AS status,
      public_pdf_url,qr_url,revoked_at
    FROM site_certificates
    WHERE certificate_code=? OR verification_token=?
  `).bind(q, q).first();
}
