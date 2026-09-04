const WINDOW = "status='published' AND public=1 AND (scheduled_at IS NULL OR datetime(scheduled_at)<=CURRENT_TIMESTAMP)";

export async function getPage(env, slug, lang = 'vi', fallback = 'vi') {
  let p = await env.DB.prepare(
    `SELECT * FROM pages WHERE slug=? AND lang=? AND ${WINDOW}`
  ).bind(slug, lang).first();
  let fellBack = false;

  if (!p && lang !== fallback) {
    p = await env.DB.prepare(
      `SELECT * FROM pages WHERE slug=? AND lang=? AND ${WINDOW}`
    ).bind(slug, fallback).first();
    fellBack = !!p;
  }
  return { page: p, fellBack };
}
