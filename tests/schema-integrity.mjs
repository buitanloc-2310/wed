import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const db = new DatabaseSync(':memory:');
for (const file of fs.readdirSync(path.join(root, 'migrations')).filter(x => x.endsWith('.sql')).sort()) {
  db.exec(fs.readFileSync(path.join(root, 'migrations', file), 'utf8'));
}

const one = sql => db.prepare(sql).get();
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
assert(one('PRAGMA integrity_check').integrity_check === 'ok', 'sqlite integrity');
assert(one('SELECT COUNT(*) c FROM site_languages').c === 2, 'Vietnamese and English only');
assert(one('SELECT COUNT(*) c FROM pages').c === 42, '42 published CMS pages across Vietnamese and English');
assert(one('SELECT COUNT(*) c FROM site_units').c === 1, '1 confirmed direct unit');
assert(one('SELECT COUNT(*) c FROM site_portals').c === 4, '4 portals');
assert(one("SELECT COUNT(*) c FROM site_menus WHERE location='header'").c >= 35, 'header menus seeded');
assert(one("SELECT COUNT(*) c FROM site_menus WHERE location LIKE 'footer_%'").c >= 10, 'footer menus CMS-driven');
assert(one("SELECT COUNT(*) c FROM site_settings WHERE group_name IN ('seo','footer','contact','i18n')").c >= 8, 'settings/SEO/footer/contact seeded');
assert(one("SELECT COUNT(*) c FROM site_ui_strings WHERE lang='vi' AND status='published'").c >= 30, 'Vietnamese UI string fallback seeded');
assert(one("SELECT COUNT(*) c FROM pragma_table_info('site_certificates') WHERE name='issuer_key_id'").c === 1, 'certificate issuer ownership column');

const publicText = [
  ...db.prepare('SELECT title,excerpt,body_html FROM pages').all().flatMap(x => [x.title,x.excerpt,x.body_html]),
  ...db.prepare('SELECT label,url FROM site_menus').all().flatMap(x => [x.label,x.url]),
  ...db.prepare('SELECT name,subtitle,description FROM site_portals').all().flatMap(x => [x.name,x.subtitle,x.description])
].filter(Boolean).join('\n');
assert(!/\bSFN\b/.test(publicText), 'forbidden public acronym absent from seeded public content');
assert(!publicText.includes('admin.skyfirst.io.vn'), 'forbidden admin subdomain absent');

console.log('SCHEMA INTEGRITY PASS: SQLite OK; 2 languages; production content rules; CMS footer/settings; certificate issuer ownership; public naming rules.');
