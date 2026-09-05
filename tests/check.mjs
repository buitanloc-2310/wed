import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(':memory:');
for (const migration of (await readdir('migrations')).filter(name => name.endsWith('.sql')).sort()) db.exec(await readFile(`migrations/${migration}`, 'utf8'));

const count = table => db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count;
assert.equal(count('languages'), 2, 'Only Vietnamese and English may be enabled');
assert.equal(count('content_topics'), 33, 'All 33 official content topics must exist');
assert.equal(count('pages'), 20, 'Both languages need the full core route set');
assert.equal(count('portals'), 4, 'The approved system portals must exist');
assert.equal(db.prepare("SELECT COUNT(*) AS count FROM pages WHERE status='published' AND is_public=1").get().count, 20);
assert.equal(db.prepare("SELECT COUNT(*) AS count FROM menu_items WHERE parent_id IS NOT NULL").get().count > 0, true, 'Menu must include submenu items');
assert.equal(db.prepare("SELECT COUNT(*) AS count FROM menu_items WHERE url='/noi-dung'").get().count, 2, 'All official content must be reachable from the menu');
const source = await readFile('src/worker.js', 'utf8');
assert.match(source, /issuer_key_id/);
assert.match(source, /\/api\/certificates\/issue/);
assert.match(source, /\/api\/admin\/settings/);
assert.match(source, /path === '\/tra-cuu'/, 'Central verification route is mandatory');
assert.doesNotMatch(source, /translate\.google|googleTranslate|libretranslate/i, 'Translation must not depend on a remote service');
assert.equal((await readdir('public', { recursive: true })).filter(file => file.endsWith('.html')).length, 0, 'Public directory must not contain old demo pages');
console.log(JSON.stringify({ settings: count('settings'), languages: count('languages'), pages: count('pages'), topics: count('content_topics'), menus: count('menu_items'), portals: count('portals'), result: 'integrity ok' }));
