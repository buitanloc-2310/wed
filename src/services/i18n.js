import { getDefaultLanguage, languageExists } from '../repositories/languages.js';

export async function resolveLanguage(env, path) {
  const defaultLanguage = await getDefaultLanguage(env);
  const parts = path.split('/').filter(Boolean);
  if (parts.length && await languageExists(env, parts[0])) {
    return {
      lang: parts[0],
      path: '/' + parts.slice(1).join('/'),
      defaultLanguage
    };
  }
  return { lang: defaultLanguage, path, defaultLanguage };
}

export function localizedPath(path, lang, defaultLanguage = 'vi') {
  const clean = path === '/' ? '' : (path.startsWith('/') ? path : `/${path}`);
  return lang === defaultLanguage
    ? (clean || '/')
    : `/${lang}${clean || '/'}`;
}

export function tr(ctx, key, fallback = '') {
  return ctx?.ui?.[key] || fallback || key;
}
