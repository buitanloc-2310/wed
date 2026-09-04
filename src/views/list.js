import { escapeHtml, escapeAttr } from '../utils/escape.js';
import { localizedPath, tr } from '../services/i18n.js';

export function postList(rows, ctx) {
  return `<section class="page-hero"><div class="container"><div class="eyebrow">${escapeHtml(tr(ctx,'news.eyebrow','Tin tức & Hoạt động'))}</div><h1>${escapeHtml(tr(ctx,'news.title','Cập nhật từ Sky First'))}</h1></div></section><section class="page-body"><div class="container cards three">${rows.length ? rows.map(x => `<article class="card"><div class="mini">${escapeHtml(x.category || 'Tin tức')}</div><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.excerpt || '')}</p><a class="textlink" href="${escapeAttr(localizedPath(`/tin-tuc/${x.slug}`, ctx.lang, ctx.defaultLanguage))}">${escapeHtml(tr(ctx,'news.read_more','Đọc tiếp →'))}</a></article>`).join('') : `<div class="note">${escapeHtml(tr(ctx,'news.empty','Chưa có bài viết công khai.'))}</div>`}</div></section>`;
}
