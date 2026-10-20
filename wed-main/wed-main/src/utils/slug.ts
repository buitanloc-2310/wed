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
