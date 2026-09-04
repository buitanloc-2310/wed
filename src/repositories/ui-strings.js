async function load(env, lang) {
  return (await env.DB.prepare(
    "SELECT key,value FROM site_ui_strings WHERE lang=? AND status='published'"
  ).bind(lang).all()).results;
}

export async function getUiStrings(env, lang, fallback) {
  const fallbackRows = fallback ? await load(env, fallback) : [];
  const currentRows = lang === fallback ? fallbackRows : await load(env, lang);
  return Object.assign(
    {},
    Object.fromEntries(fallbackRows.map(x => [x.key, x.value])),
    Object.fromEntries(currentRows.map(x => [x.key, x.value]))
  );
}
