export async function getSettings(env, publicOnly = false) {
  const q = publicOnly
    ? 'SELECT key,value FROM site_settings WHERE is_public=1'
    : 'SELECT key,value,group_name,value_type,is_public,updated_at FROM site_settings ORDER BY group_name,key';
  const rows = (await env.DB.prepare(q).all()).results;
  return publicOnly ? Object.fromEntries(rows.map(r => [r.key, r.value])) : rows;
}
