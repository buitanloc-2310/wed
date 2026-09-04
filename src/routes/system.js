import { text } from '../utils/response.js';
import { getDefaultLanguage } from '../repositories/languages.js';
import { localizedPath } from '../services/i18n.js';

function xmlEscape(s) {
  return String(s).replace(/[<>&'\"]/g, c => ({ '<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;' }[c]));
}

export async function systemRoute(request, env, url) {
  const base = String(env.APP_URL || 'https://skyfirst.io.vn').replace(/\/$/, '');

  if (url.pathname === '/robots.txt') {
    return text(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\nSitemap: ${base}/sitemap.xml\n`);
  }

  if (url.pathname === '/sitemap.xml') {
    const defaultLanguage = await getDefaultLanguage(env);
    const [pages, posts] = await Promise.all([
      env.DB.prepare(`
        SELECT slug,lang,updated_at FROM pages
        WHERE status='published' AND public=1
          AND (scheduled_at IS NULL OR datetime(scheduled_at)<=CURRENT_TIMESTAMP)
      `).all(),
      env.DB.prepare(`
        SELECT slug,lang,updated_at FROM posts
        WHERE status='published' AND public=1
          AND (scheduled_at IS NULL OR datetime(scheduled_at)<=CURRENT_TIMESTAMP)
      `).all()
    ]);

    const entries = [
      ...pages.results.map(x => ({
        path: localizedPath(x.slug ? `/${x.slug}` : '/', x.lang, defaultLanguage),
        updated_at: x.updated_at
      })),
      ...posts.results.map(x => ({
        path: localizedPath(`/tin-tuc/${x.slug}`, x.lang, defaultLanguage),
        updated_at: x.updated_at
      })),
      { path: localizedPath('/tra-cuu', defaultLanguage, defaultLanguage), updated_at: null }
    ];

    const seen = new Set();
    const xmlItems = entries.filter(x => {
      if (seen.has(x.path)) return false;
      seen.add(x.path);
      return true;
    }).map(x => `<url><loc>${xmlEscape(base + x.path)}</loc>${x.updated_at ? `<lastmod>${xmlEscape(new Date(x.updated_at + (x.updated_at.endsWith('Z') ? '' : 'Z')).toISOString())}</lastmod>` : ''}</url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlItems}</urlset>`;
    return new Response(xml, { headers: { 'content-type':'application/xml; charset=utf-8', 'cache-control':'public,max-age=900' } });
  }

  return null;
}
