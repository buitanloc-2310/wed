const PUBLISHED_WINDOW = "p.status='published' AND p.public=1 AND (p.scheduled_at IS NULL OR datetime(p.scheduled_at)<=CURRENT_TIMESTAMP)";

async function queryPosts(env, lang, limit) {
  return (await env.DB.prepare(`
    SELECT p.id,p.slug,p.title,p.excerpt,p.featured_image,p.published_at,p.scheduled_at,c.name category
    FROM posts p
    LEFT JOIN categories c ON c.id=p.category_id
    WHERE p.lang=? AND ${PUBLISHED_WINDOW}
    ORDER BY COALESCE(p.published_at,p.scheduled_at,p.created_at) DESC
    LIMIT ?
  `).bind(lang, limit).all()).results;
}

export async function latestPosts(env, lang = 'vi', limit = 6, fallback = 'vi') {
  let rows = await queryPosts(env, lang, limit);
  if (!rows.length && lang !== fallback) rows = await queryPosts(env, fallback, limit);
  return rows;
}

export async function publishedPrograms(env, limit = 6) {
  return (await env.DB.prepare(
    "SELECT * FROM programs WHERE public=1 AND status IN ('upcoming','open','running') ORDER BY sort_order,id DESC LIMIT ?"
  ).bind(limit).all()).results;
}

export async function publicUnits(env) {
  return (await env.DB.prepare(
    "SELECT * FROM site_units WHERE public=1 AND status='active' ORDER BY sort_order,id"
  ).all()).results;
}

export async function publicPortals(env) {
  return (await env.DB.prepare(
    "SELECT * FROM site_portals WHERE public=1 AND status NOT IN ('hidden','retired') ORDER BY sort_order,id"
  ).all()).results;
}
