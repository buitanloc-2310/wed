/**
 * Helper utility to create clean, SEO-friendly Vietnamese URL slugs
 */

export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .trim()
    .replace(/\s+/g, '-') // spaces to dash
    .replace(/-+/g, '-'); // collapse multiple dashes
}

export function getProgramSlug(program: { id: string; title: string; slug?: string }): string {
  if (program.slug && program.slug.trim()) return program.slug.trim();
  const generated = generateSlug(program.title);
  return generated ? `${generated}-${program.id.replace(/^prog-/, '')}` : program.id;
}

export function getArticleSlug(article: { id: string; title: string; slug?: string }): string {
  if (article.slug && article.slug.trim()) return article.slug.trim();
  const generated = generateSlug(article.title);
  return generated ? `${generated}-${article.id.replace(/^news-/, '')}` : article.id;
}

export function getUnitSlug(unit: { id: string; code?: string; name: string; slug?: string }): string {
  if (unit.slug && unit.slug.trim()) return unit.slug.trim();
  if (unit.code) return unit.code.toLowerCase();
  return generateSlug(unit.name) || unit.id;
}
export function createUniqueSlug(text: string, existingSlugs: string[], currentSlug?: string): string {
  const base = generateSlug(text) || 'noi-dung';
  const used = new Set(existingSlugs.filter(Boolean).filter(s => s !== currentSlug).map(s => s.toLowerCase()));
  if (!used.has(base)) return base;
  let n=2; while (used.has(`${base}-${n}`)) n++; return `${base}-${n}`;
}
