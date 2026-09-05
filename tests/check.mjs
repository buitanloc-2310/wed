import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
const root=new URL('..',import.meta.url).pathname;
async function files(dir){const items=await readdir(dir);return (await Promise.all(items.map(async x=>{const p=join(dir,x),s=await stat(p);return s.isDirectory()?files(p):[p]}))).flat();}
const source=await files(join(root,'src')); for(const file of source.filter(x=>x.endsWith('.js'))){const text=await readFile(file,'utf8');if(!text.includes('export')&&!file.endsWith('worker.js'))throw new Error(`No module export: ${file}`);}
const seed=await readFile(join(root,'migrations/0002_seed_official_content.sql'),'utf8'); const vi=(seed.match(/','vi',\d+,/g)||[]).length; if(vi!==33)throw new Error(`Expected 33 Vietnamese official topics, got ${vi}`);
const schema=await readFile(join(root,'migrations/0001_schema.sql'),'utf8'); for(const table of ['sky_settings','sky_topics','sky_submissions','sky_certificates','sky_admins','sky_media'])if(!schema.includes(table))throw new Error(`Missing ${table}`);
const database=new DatabaseSync(':memory:'); database.exec(schema); database.exec(seed); const enCount=database.prepare("SELECT count(*) AS n FROM sky_topics WHERE locale='en'").get().n; if(enCount!==33)throw new Error(`Expected 33 English official topics, got ${enCount}`);
const config=await readFile(join(root,'wrangler.jsonc'),'utf8'); if(!config.includes('"name": "wed"')||!config.includes('e08566ab-be0d-49de-8d6a-e884912c765d'))throw new Error('Cloudflare binding mismatch');
console.log(`Structural checks passed: ${vi} official Vietnamese topics, modular source, independent schema.`);
