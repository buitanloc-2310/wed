import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const db = new DatabaseSync(':memory:');
const legacyTables = ['admins','audit_log','certificates','content','forms','galleries','gallery_items','languages','media','menus','partners','portals','sessions','settings','units'];
for (const name of legacyTables) db.exec(`CREATE TABLE ${name}(id INTEGER PRIMARY KEY, marker TEXT); INSERT INTO ${name}(marker) VALUES('legacy-preserved');`);
for (const file of fs.readdirSync(path.join(root, 'migrations')).filter(x => x.endsWith('.sql')).sort()) {
  db.exec(fs.readFileSync(path.join(root, 'migrations', file), 'utf8'));
}
for (const name of legacyTables) {
  const row = db.prepare(`SELECT marker FROM ${name} LIMIT 1`).get();
  if (row?.marker !== 'legacy-preserved') throw new Error(`legacy table changed: ${name}`);
}
if (db.prepare('SELECT COUNT(*) c FROM pages').get().c !== 42) throw new Error('Production CMS pages missing after legacy migration');
if (db.prepare('PRAGMA integrity_check').get().integrity_check !== 'ok') throw new Error('integrity failed');
console.log('LEGACY COMPAT PASS: previous trial tables remain untouched while Production V2 schema is added.');
