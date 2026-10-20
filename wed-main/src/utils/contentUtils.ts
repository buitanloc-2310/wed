


// -----------------------------------------------------------------------------
// Preserved component source: slug.ts
// -----------------------------------------------------------------------------

/** Helper utility to create clean, SEO-friendly Vietnamese URL slugs. */
export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * CMS data can occasionally contain a full URL copied into a slug field.
 * Public routing only accepts one clean path segment, never a nested/full URL.
 */
export function normalizeStoredSlug(value?: string): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const decoded = decodeURIComponent(raw);
    const urlMatch = decoded.match(/https?:\/\/[^\s]+/i);
    if (urlMatch) {
      const parsed = new URL(urlMatch[0]);
      const parts = parsed.pathname.split('/').filter(Boolean);
      const candidate = parts[parts.length - 1] || '';
      return generateSlug(candidate);
    }
    const pathParts = decoded.split(/[/?#]/).filter(Boolean);
    const candidate = pathParts[pathParts.length - 1] || decoded;
    return generateSlug(candidate);
  } catch {
    return generateSlug(raw);
  }
}

export function getProgramSlug(program: { id: string; title: string; slug?: string }): string {
  const stored = normalizeStoredSlug(program.slug);
  if (stored) return stored;
  const generated = generateSlug(program.title);
  return generated ? `${generated}-${generateSlug(program.id.replace(/^prog-/, ''))}` : generateSlug(program.id);
}

export function getArticleSlug(article: { id: string; title: string; slug?: string }): string {
  const stored = normalizeStoredSlug(article.slug);
  if (stored) return stored;
  const generated = generateSlug(article.title);
  return generated ? `${generated}-${generateSlug(article.id.replace(/^news-/, ''))}` : generateSlug(article.id);
}

export function getUnitSlug(unit: { id: string; code?: string; name: string; slug?: string }): string {
  const stored = normalizeStoredSlug(unit.slug);
  if (stored) return stored;
  if (unit.code) return generateSlug(unit.code);
  return generateSlug(unit.name) || generateSlug(unit.id);
}

export function createUniqueSlug(text: string, existingSlugs: string[], currentSlug?: string): string {
  const base = generateSlug(text) || 'noi-dung';
  const used = new Set(existingSlugs.filter(Boolean).filter(s => s !== currentSlug).map(s => normalizeStoredSlug(s).toLowerCase()));
  if (!used.has(base)) return base;
  let n = 2;
  while (used.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}


// -----------------------------------------------------------------------------
// Preserved component source: sanitizeHtml.ts
// -----------------------------------------------------------------------------

const ALLOWED_TAGS = new Set(['A','B','BLOCKQUOTE','BR','CODE','DIV','EM','FIGURE','FIGCAPTION','H1','H2','H3','H4','H5','H6','HR','I','IMG','LI','OL','P','PRE','S','SPAN','STRONG','TABLE','TBODY','TD','TH','THEAD','TR','U','UL']);
const ALLOWED_ATTRS = new Set(['href','target','rel','class','colspan','rowspan','style','src','alt','width','height']);
const SAFE_STYLE = /^(?:\s*(?:text-align|color|background-color|font-weight|font-style|text-decoration)\s*:\s*[^;]+;?\s*)+$/i;
export function sanitizeHtml(input: string): string {
  if (!input || typeof window === 'undefined') return input || '';
  const doc = new DOMParser().parseFromString(`<div>${input}</div>`, 'text/html');
  const root = doc.body.firstElementChild as HTMLElement | null;
  if (!root) return '';
  root.querySelectorAll('*').forEach((el) => {
    if (['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','SVG','MATH'].includes(el.tagName)){el.remove();return;}
    if (!ALLOWED_TAGS.has(el.tagName)) { el.replaceWith(...Array.from(el.childNodes)); return; }
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase(); const value = attr.value.trim();
      if (!ALLOWED_ATTRS.has(name) || name.startsWith('on')) el.removeAttribute(attr.name);
      else if ((name === 'href' || name === 'src') && !/^(https?:|mailto:|tel:|\/|#)/i.test(value)) el.removeAttribute(attr.name);
      else if (name === 'style' && !SAFE_STYLE.test(value)) el.removeAttribute(attr.name);
    });
    if (el.tagName === 'A' && el.getAttribute('target') === '_blank') el.setAttribute('rel','noopener noreferrer');
  });
  return root.innerHTML;
}

