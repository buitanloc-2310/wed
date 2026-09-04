export async function getLanguages(env, enabledOnly = true) {
  const q = enabledOnly
    ? 'SELECT * FROM site_languages WHERE enabled=1 ORDER BY sort_order, code'
    : 'SELECT * FROM site_languages ORDER BY sort_order, code';
  return (await env.DB.prepare(q).all()).results;
}

export async function getDefaultLanguage(env) {
  const row = await env.DB.prepare(
    'SELECT code FROM site_languages WHERE enabled=1 AND is_default=1 ORDER BY sort_order LIMIT 1'
  ).first();
  if (row?.code) return row.code;
  const fallback = await env.DB.prepare(
    'SELECT code FROM site_languages WHERE enabled=1 ORDER BY sort_order, code LIMIT 1'
  ).first();
  return fallback?.code || 'vi';
}

export async function languageExists(env, code) {
  return !!(await env.DB.prepare(
    'SELECT 1 ok FROM site_languages WHERE code=? AND enabled=1'
  ).bind(code).first());
}
