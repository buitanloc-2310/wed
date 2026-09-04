import { getSettings } from '../repositories/settings.js';
import { getLanguages, getDefaultLanguage, languageExists } from '../repositories/languages.js';
import { getMenus } from '../repositories/menus.js';
import { publicPortals } from '../repositories/content.js';
import { getUiStrings } from '../repositories/ui-strings.js';

export async function publicContext(env, lang) {
  const [settings, defaultLanguage] = await Promise.all([
    getSettings(env, true),
    getDefaultLanguage(env)
  ]);

  const configuredFallback = String(settings.fallback_language || '').trim();
  const fallbackLanguage = configuredFallback && await languageExists(env, configuredFallback)
    ? configuredFallback
    : defaultLanguage;

  const [languages, menus, footerQuick, footerJoin, footerPolicy, portals, ui] = await Promise.all([
    getLanguages(env, true),
    getMenus(env, lang, 'header', fallbackLanguage).catch(() => []),
    getMenus(env, lang, 'footer_quick', fallbackLanguage).catch(() => []),
    getMenus(env, lang, 'footer_join', fallbackLanguage).catch(() => []),
    getMenus(env, lang, 'footer_policy', fallbackLanguage).catch(() => []),
    publicPortals(env),
    getUiStrings(env, lang, fallbackLanguage)
  ]);

  return {
    settings,
    languages,
    defaultLanguage,
    fallbackLanguage,
    menus,
    footerQuick,
    footerJoin,
    footerPolicy,
    portals,
    ui,
    lang
  };
}
