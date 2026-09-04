import { escapeHtml, escapeAttr } from '../utils/escape.js';
import { localizedPath, tr } from '../services/i18n.js';

function internalHref(url, ctx) {
  if (!url || !url.startsWith('/') || url.startsWith('//')) return url || '#';
  if (/^\/(?:api|admin|assets|media)(?:\/|$)/.test(url)) return url;
  return localizedPath(url, ctx.lang, ctx.defaultLanguage);
}

function menuTree(items, ctx) {
  const roots = items.filter(x => !x.parent_id);
  return roots.map(r => {
    const kids = items.filter(x => x.parent_id === r.id);
    const rootHref = internalHref(r.url, ctx);
    if (!kids.length) {
      return `<a href="${escapeAttr(rootHref)}"${r.new_tab ? ' target="_blank" rel="noopener"' : ''}>${escapeHtml(r.label)}</a>`;
    }
    return `<div class="navdrop"><button type="button" aria-haspopup="true" aria-expanded="false">${escapeHtml(r.label)} <span aria-hidden="true">⌄</span></button><div class="dropdown">${kids.map(k => `<a href="${escapeAttr(internalHref(k.url, ctx))}"${k.new_tab ? ' target="_blank" rel="noopener"' : ''}>${escapeHtml(k.label)}</a>`).join('')}</div></div>`;
  }).join('');
}

function languageSelect(ctx, path) {
  return `<select id="languageSelect" class="language-select" aria-label="Ngôn ngữ" data-current-path="${escapeAttr(path)}" data-default-language="${escapeAttr(ctx.defaultLanguage)}">${ctx.languages.map(l => `<option value="${escapeAttr(l.code)}"${l.code === ctx.lang ? ' selected' : ''}>${escapeHtml(l.native_name)} · ${escapeHtml(l.code.toUpperCase())}</option>`).join('')}</select>`;
}

function footerLinks(items, ctx) {
  if (!items?.length) return '<span class="muted">Đang cập nhật</span>';
  return items.map(item => `<a href="${escapeAttr(internalHref(item.url, ctx))}"${item.new_tab ? ' target="_blank" rel="noopener"' : ''}>${escapeHtml(item.label)}</a>`).join('');
}

function structuredData(ctx) {
  const s = ctx.settings;
  const sameAs = [s.facebook_url, s.instagram_url, s.tiktok_url].filter(Boolean);
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: s.organization_name || 'Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First',
    alternateName: 'Sky First Network',
    url: 'https://skyfirst.io.vn',
    logo: 'https://skyfirst.io.vn/assets/branding/sky-first-main-logo.png',
    email: s.email_main || undefined,
    sameAs
  }).replace(/</g, '\\u003c');
}

function safeColor(value, fallback) { return /^#[0-9a-f]{3,8}$/i.test(String(value || '')) ? value : fallback; }
function themeVariables(settings) {
  const radius = /^\d{1,2}$/.test(String(settings.border_radius || '')) ? settings.border_radius : '18';
  const primary = safeColor(settings.brand_primary,'#159BFF');
  const navy = safeColor(settings.brand_navy,'#062A67');
  const surface = safeColor(settings.surface_color,'#FFFFFF');
  const background = safeColor(settings.page_background,'#F7FBFF');
  return `<style>:root{--blue:${primary};--deep:${navy};--navy:${navy};--white:${surface};--paper:${surface};--soft:${background};--wash:${background};--ink:${safeColor(settings.text_color,'#172033')};--radius:${radius}px}</style>`;
}

export function layout({ ctx, title, description, body, path = '/', fallback = false, ogImage = '' }) {
  const s = ctx.settings;
  const canonical = `https://skyfirst.io.vn${localizedPath(path, ctx.lang, ctx.defaultLanguage)}`;
  const hreflang = ctx.languages.map(l => `<link rel="alternate" hreflang="${escapeAttr(l.code)}" href="https://skyfirst.io.vn${localizedPath(path, l.code, ctx.defaultLanguage)}">`).join('');
  const xDefault = `<link rel="alternate" hreflang="x-default" href="https://skyfirst.io.vn${localizedPath(path, ctx.defaultLanguage, ctx.defaultLanguage)}">`;
  const finalDescription = description || s.default_meta_description || '';
  const finalOg = ogImage || s.default_og_image || 'https://skyfirst.io.vn/assets/branding/sky-first-main-logo.png';
  const favicon = s.favicon_url || '/assets/branding/sky-first-main-logo.png';
  const homeHref = localizedPath('/', ctx.lang, ctx.defaultLanguage);
  const currentYear = new Date().getUTCFullYear();

  return `<!doctype html><html lang="${escapeAttr(ctx.lang)}" dir="${ctx.languages.find(x => x.code === ctx.lang)?.direction || 'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeAttr(finalDescription)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${escapeAttr(canonical)}">${hreflang}${xDefault}<meta property="og:type" content="website"><meta property="og:site_name" content="SKY FIRST NETWORK"><meta property="og:title" content="${escapeAttr(title)}"><meta property="og:description" content="${escapeAttr(finalDescription)}"><meta property="og:url" content="${escapeAttr(canonical)}"><meta property="og:image" content="${escapeAttr(finalOg)}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${escapeAttr(favicon)}"><link rel="apple-touch-icon" href="${escapeAttr(favicon)}"><link rel="stylesheet" href="/assets/css/site.css">${themeVariables(s)}<script type="application/ld+json">${structuredData(ctx)}</script><script defer src="/assets/js/site.js"></script></head><body><header class="site-header"><div class="topline"><div class="container topline-inner"><span>${escapeHtml(s.organization_name || 'Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First')}</span><span class="topline-brand">${escapeHtml(s.tagline || 'Giáo dục · Văn hóa · Cộng đồng')}</span></div></div><div class="container navrow"><a class="brand" href="${escapeAttr(homeHref)}"><img src="${escapeAttr(s.header_logo_url || '/assets/branding/sky-first-main-logo.png')}" alt="Sky First"><span>SKY FIRST NETWORK</span></a><nav class="desktop-nav" aria-label="Điều hướng chính">${menuTree(ctx.menus, ctx)}</nav><div class="nav-actions">${languageSelect(ctx, path)}<button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false">☰</button></div></div><div class="mobile-nav">${menuTree(ctx.menus, ctx)}</div></header>${fallback ? `<div class="translation-note">${escapeHtml(tr(ctx,'translation.fallback','Bản dịch tương ứng chưa được xuất bản; hệ thống đang hiển thị nội dung ở ngôn ngữ dự phòng.'))}</div>` : ''}<main>${body}</main>${footer(ctx, currentYear)}</body></html>`;
}

function footer(ctx, currentYear) {
  const s = ctx.settings;
  const social = [
    ['Facebook', s.facebook_url],
    ['Instagram', s.instagram_url],
    ['TikTok', s.tiktok_url]
  ].filter(([, url]) => !!url);

  return `<footer class="site-footer"><div class="container footer-grid"><div><img class="footer-logo" src="/assets/branding/sky-first-main-logo.png" alt="Sky First"><p>${escapeHtml(s.organization_name || 'Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First')}</p><p class="muted">${escapeHtml(s.footer_description || s.tagline || 'Giáo dục · Phát triển người trẻ · Cộng đồng')}</p></div><div><h3>${escapeHtml(tr(ctx,'footer.explore','Khám phá'))}</h3>${footerLinks(ctx.footerQuick, ctx)}</div><div><h3>${escapeHtml(tr(ctx,'footer.join','Tham gia'))}</h3>${footerLinks(ctx.footerJoin, ctx)}<h3 class="footer-subhead">${escapeHtml(tr(ctx,'footer.systems','Hệ thống Sky First'))}</h3>${ctx.portals.filter(p => p.show_footer).map(p => `<a href="${escapeAttr(p.url)}" target="_blank" rel="noopener">${escapeHtml(p.name)}${p.status === 'maintenance' ? ' · Bảo trì' : ''}</a>`).join('')}</div><div><h3>${escapeHtml(tr(ctx,'footer.contact','Liên hệ'))}</h3>${s.email_main ? `<a href="mailto:${escapeAttr(s.email_main)}">${escapeHtml(s.email_main)}</a>` : ''}${s.email_support ? `<a href="mailto:${escapeAttr(s.email_support)}">${escapeHtml(s.email_support)}</a>` : ''}${s.hotline ? `<p>Hotline/Zalo: ${escapeHtml(s.hotline)}</p>` : ''}<div class="socials">${social.map(([label, url]) => `<a href="${escapeAttr(url)}" target="_blank" rel="noopener">${label}</a>`).join('')}</div></div></div><div class="container footer-bottom"><span>© ${currentYear} SKY FIRST NETWORK</span><span>${footerLinks(ctx.footerPolicy, ctx)}</span></div></footer>`;
}
