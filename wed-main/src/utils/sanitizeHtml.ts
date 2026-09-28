const ALLOWED_TAGS = new Set(['A','B','BLOCKQUOTE','BR','CODE','DIV','EM','H1','H2','H3','H4','H5','H6','HR','I','IMG','LI','OL','P','PRE','S','SPAN','STRONG','TABLE','TBODY','TD','TH','THEAD','TR','U','UL']);
const ALLOWED_ATTRS = new Set(['href','target','rel','class','colspan','rowspan','style','src','alt','width','height']);
const SAFE_STYLE = /^(?:\s*(?:text-align|color|background-color|font-weight|font-style|text-decoration)\s*:\s*[^;]+;?\s*)+$/i;
export function sanitizeHtml(input: string): string {
  if (!input || typeof window === 'undefined') return input || '';
  const doc = new DOMParser().parseFromString(`<div>${input}</div>`, 'text/html');
  const root = doc.body.firstElementChild as HTMLElement | null;
  if (!root) return '';
  root.querySelectorAll('*').forEach((el) => {
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
