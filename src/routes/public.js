import { html } from '../utils/response.js';
import { getPage } from '../repositories/pages.js';
import { latestPosts, publishedPrograms, publicUnits, publicPortals } from '../repositories/content.js';
import { verifyCertificate } from '../repositories/certificates.js';
import { publicContext } from '../services/public-context.js';
import { resolveLanguage } from '../services/i18n.js';
import { layout } from '../views/layout.js';
import { standardPage, notFound } from '../views/page.js';
import { homeView } from '../views/home.js';
import { postList } from '../views/list.js';
import { certificateSearch } from '../views/certificate.js';
import { contactForm } from '../views/contact.js';
import { participationForm } from '../views/forms.js';
import { activePrograms, activeClasses, publicTeam, publicPartners, publicAlbums, publicDocuments, publicStats } from '../repositories/dynamic.js';
import { programsBlock, teamBlock, partnersBlock, albumsBlock, documentsBlock, statsBlock } from '../views/dynamic.js';
import { sponsorshipPage } from '../views/sponsorship.js';

const PUBLICATION_WINDOW = "status='published' AND public=1 AND (scheduled_at IS NULL OR datetime(scheduled_at)<=CURRENT_TIMESTAMP)";

export async function publicRoute(request, env, url) {
  const resolved = await resolveLanguage(env, url.pathname);
  const lang = resolved.lang;
  const path = resolved.path || '/';

  if (path.startsWith('/api/') || path === '/admin' || path.startsWith('/admin/') || path.startsWith('/media/') || path.startsWith('/assets/')) return null;

  // The former static export is not a second website. Keep old bookmarks working
  // while routing every public request through the CMS-rendered pages.
  const legacyPath = {
    '/index.html': '/home',
    '/index-hoan-chinh.html': '/home',
    '/gioi-thieu.html': '/gioi-thieu',
    '/tin-tuc.html': '/tin-tuc',
    '/lien-he.html': '/lien-he',
    '/tai-tro-dong-hanh.html': '/tai-tro-dong-hanh',
    '/thanh-tich.html': '/tra-cuu'
  }[path];
  if (legacyPath) {
    const prefix = lang === 'vi' ? '' : `/${lang}`;
    return new Response(null, { status: 301, headers: { location: `${prefix}${legacyPath}${url.search}` } });
  }

  const ctx = await publicContext(env, lang);

  if (path === '/' || path === '' || path === '/home') {
    const { page, fellBack } = await getPage(env, '', lang, ctx.fallbackLanguage);
    const [posts, programs, units, portals] = await Promise.all([
      latestPosts(env, lang, 3, ctx.fallbackLanguage),
      publishedPrograms(env, 6),
      publicUnits(env),
      publicPortals(env)
    ]);
    const body = homeView(page, { posts, programs, units, portals }, ctx);
    return html(layout({
      ctx,
      title: 'SKY FIRST NETWORK | Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First',
      description: ctx.settings.default_meta_description,
      body,
      path: path === '/home' ? '/home' : '/',
      fallback: fellBack,
      ogImage: page?.og_image
    }));
  }

  if (path === '/tin-tuc') {
    const rows = await latestPosts(env, lang, 50, ctx.fallbackLanguage);
    return html(layout({
      ctx,
      title: 'Tin tức | Sky First Network',
      description: 'Tin tức và hoạt động mới từ Sky First.',
      body: postList(rows, ctx),
      path,
      fallback: false
    }));
  }

  if (path.startsWith('/tin-tuc/')) {
    const slug = decodeURIComponent(path.slice('/tin-tuc/'.length));
    let post = await env.DB.prepare(`SELECT * FROM posts WHERE slug=? AND lang=? AND ${PUBLICATION_WINDOW}`).bind(slug, lang).first();
    let fb = false;
    if (!post && lang !== ctx.fallbackLanguage) {
      post = await env.DB.prepare(`SELECT * FROM posts WHERE slug=? AND lang=? AND ${PUBLICATION_WINDOW}`).bind(slug, ctx.fallbackLanguage).first();
      fb = !!post;
    }
    if (post) {
      return html(layout({
        ctx,
        title: `${post.seo_title || post.title} | Sky First Network`,
        description: post.seo_description || post.excerpt || '',
        body: standardPage(post, ctx),
        path,
        fallback: fb,
        ogImage: post.og_image || post.featured_image
      }));
    }
  }

  if (path === '/tra-cuu' || path.startsWith('/tra-cuu/')) {
    const q = (url.searchParams.get('q') || decodeURIComponent(path.slice('/tra-cuu/'.length))).trim();
    const c = await verifyCertificate(env, q);
    return html(layout({
      ctx,
      title: 'Tra cứu Giấy chứng nhận | Sky First Network',
      description: 'Xác thực Giấy chứng nhận Sky First.',
      body: certificateSearch(q, c, ctx),
      path: '/tra-cuu'
    }));
  }

  if (path === '/tai-tro-dong-hanh') {
    return html(layout({
      ctx,
      title: 'Tài trợ & Đồng hành | Sky First Network',
      description: 'Kênh tiếp nhận đóng góp chính thức của Sky First Network.',
      body: sponsorshipPage(ctx),
      path
    }));
  }

  const slug = path.replace(/^\//, '').replace(/\/$/, '');
  const { page, fellBack } = await getPage(env, slug, lang, ctx.fallbackLanguage);
  if (page) {
    let body = standardPage(page, ctx);
    if (slug === 'lien-he') body += contactForm(ctx);
    if (slug === 'core-team') body += participationForm('core_team');
    if (slug === 'tinh-nguyen-vien') body += participationForm('volunteer');
    if (slug === 'nguoi-hoc') body += participationForm('learner');
    if (slug === 'hop-tac') body += participationForm('cooperation');
    if (slug === 'chuong-trinh') {
      const [pr, cl] = await Promise.all([activePrograms(env), activeClasses(env)]);
      body += programsBlock(pr, cl);
    }
    if (slug === 'doi-ngu') body += teamBlock(await publicTeam(env));
    if (slug === 'doi-tac') body += partnersBlock(await publicPartners(env));
    if (slug === 'so-lieu') body += statsBlock(await publicStats(env));
    if (slug === 'thu-vien') {
      const [al, docs] = await Promise.all([publicAlbums(env), publicDocuments(env)]);
      body += albumsBlock(al) + documentsBlock(docs);
    }
    if (slug === 'thu-vien-anh') body += albumsBlock(await publicAlbums(env));
    if (slug === 'tai-lieu') body += documentsBlock(await publicDocuments(env));

    return html(layout({
      ctx,
      title: page.seo_title || `${page.title} | Sky First Network`,
      description: page.seo_description || page.excerpt || '',
      body,
      path,
      fallback: fellBack,
      ogImage: page.og_image
    }));
  }

  return html(layout({
    ctx,
    title: '404 | Sky First Network',
    description: 'Không tìm thấy nội dung.',
    body: notFound(ctx),
    path
  }), 404);
}
