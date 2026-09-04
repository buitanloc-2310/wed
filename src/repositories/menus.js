export async function getMenus(env, lang = 'vi', location = 'header', fallback = 'vi') {
  let rows = (await env.DB.prepare(
    'SELECT * FROM site_menus WHERE location=? AND lang=? AND visible=1 ORDER BY parent_id IS NOT NULL,parent_id,sort_order,id'
  ).bind(location, lang).all()).results;
  if (!rows.length && lang !== fallback) {
    rows = (await env.DB.prepare(
      'SELECT * FROM site_menus WHERE location=? AND lang=? AND visible=1 ORDER BY parent_id IS NOT NULL,parent_id,sort_order,id'
    ).bind(location, fallback).all()).results;
  }
  return rows;
}
