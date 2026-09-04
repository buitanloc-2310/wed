import { escapeHtml, escapeAttr } from '../utils/escape.js';
import { localizedPath, tr } from '../services/i18n.js';

function localizeBodyLinks(html, ctx) {
  if (!html || !ctx || ctx.lang === ctx.defaultLanguage) return html || '';
  return String(html).replace(/href=(['"])(\/(?!\/|api(?:\/|$)|admin(?:\/|$)|assets(?:\/|$)|media(?:\/|$))[^'"]*)\1/gi, (_m, quote, url) => {
    return `href=${quote}${escapeAttr(localizedPath(url, ctx.lang, ctx.defaultLanguage))}${quote}`;
  });
}

export function standardPage(page, ctx) {
  return `<section class="page-hero"><div class="container"><div class="eyebrow">SKY FIRST NETWORK</div><h1>${escapeHtml(page.title)}</h1>${page.excerpt ? `<p class="lead">${escapeHtml(page.excerpt)}</p>` : ''}</div></section><section class="page-body"><div class="container content-prose">${localizeBodyLinks(page.body_html, ctx)}</div></section>`;
}

export function notFound(ctx) {
  const href = ctx ? localizedPath('/', ctx.lang, ctx.defaultLanguage) : '/';
  return `<section class="page-hero"><div class="container"><div class="eyebrow">404</div><h1>${escapeHtml(tr(ctx,'common.not_found_title','Không tìm thấy nội dung'))}</h1><p class="lead">${escapeHtml(tr(ctx,'common.not_found_body','Trang bạn yêu cầu không tồn tại hoặc chưa được công khai.'))}</p><a class="btn primary" href="${escapeAttr(href)}">${escapeHtml(tr(ctx,'common.home','Về Trang chủ'))}</a></div></section>`;
}

export function systemError() {
  return `<section class="page-hero"><div class="container"><div class="eyebrow">SYSTEM ERROR</div><h1>Hệ thống chưa thể xử lý yêu cầu</h1><p class="lead">Vui lòng thử lại sau.</p><a class="btn primary" href="/">Về Trang chủ</a></div></section>`;
}
