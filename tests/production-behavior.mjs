import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import worker from '../src/index.js';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const db = new DatabaseSync(':memory:');
for (const file of fs.readdirSync(path.join(root, 'migrations')).filter(x => x.endsWith('.sql')).sort()) {
  db.exec(fs.readFileSync(path.join(root, 'migrations', file), 'utf8'));
}

class StmtWrap {
  constructor(stmt) { this.stmt = stmt; this.args = []; }
  bind(...args) { this.args = args; return this; }
  async first() { return this.stmt.get(...this.args) ?? null; }
  async all() { return { results: this.stmt.all(...this.args) }; }
  async run() {
    const r = this.stmt.run(...this.args);
    return { success: true, meta: { last_row_id: Number(r.lastInsertRowid || 0), changes: Number(r.changes || 0) } };
  }
}

const DB = {
  prepare(sql) { return new StmtWrap(db.prepare(sql)); },
  async batch(items) {
    const out = [];
    db.exec('BEGIN');
    try {
      for (const x of items) out.push(await x.run());
      db.exec('COMMIT');
      return out;
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }
  }
};

const objects = new Map();
const MEDIA = {
  async put(key, body, opts = {}) {
    const bytes = body instanceof ArrayBuffer ? new Uint8Array(body) : new Uint8Array(await new Response(body).arrayBuffer());
    objects.set(key, { bytes, httpMetadata: opts.httpMetadata || {}, httpEtag: '"qa-etag"' });
  },
  async get(key) {
    const x = objects.get(key);
    if (!x) return null;
    return { body: x.bytes, httpMetadata: x.httpMetadata, httpEtag: x.httpEtag };
  }
};

const ASSETS = {
  async fetch(request) {
    const u = new URL(request.url);
    const rel = u.pathname.replace(/^\//, '');
    const f = path.join(root, 'public', rel);
    if (!f.startsWith(path.join(root, 'public')) || !fs.existsSync(f)) return new Response('Not found', { status: 404 });
    const ext = path.extname(f);
    const type = ext === '.css' ? 'text/css' : ext === '.js' ? 'text/javascript' : ext === '.png' ? 'image/png' : ext === '.jpg' ? 'image/jpeg' : 'application/octet-stream';
    return new Response(fs.readFileSync(f), { headers: { 'content-type': type } });
  }
};

const env = { DB, ASSETS, MEDIA, APP_NAME:'Sky First Network', APP_URL:'https://skyfirst.io.vn', DEFAULT_LANGUAGE:'vi' };
const hit = (pathname, opt = {}) => worker.fetch(new Request('https://skyfirst.io.vn' + pathname, opt), env);
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
const bodyJson = async r => { const j = await r.json(); return j; };

async function setupAndLogin() {
  let r = await hit('/api/admin/setup', {
    method:'POST', headers:{'content-type':'application/json'},
    body:JSON.stringify({ name:'Production QA', email:'super@example.com', password:'Strong-Super-Password-2026!' })
  });
  assert(r.status === 201, 'super setup');
  return login('super@example.com', 'Strong-Super-Password-2026!');
}

async function login(email, password) {
  const r = await hit('/api/admin/login', {
    method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ email, password })
  });
  assert(r.status === 200, `login ${email}`);
  const j = await r.json();
  return { cookie:r.headers.get('set-cookie').split(';')[0], csrf:j.csrf, admin:j.admin };
}

async function authHit(session, pathname, opt = {}) {
  const headers = new Headers(opt.headers || {});
  headers.set('cookie', session.cookie);
  if (!['GET','HEAD'].includes(opt.method || 'GET')) headers.set('x-csrf-token', session.csrf);
  return hit(pathname, { ...opt, headers });
}

const superSession = await setupAndLogin();

// Settings/Footer/SEO resource is real and writable by SUPER ADMIN.
let r = await authHit(superSession, '/api/admin/resources/settings');
assert(r.status === 200, 'settings readable by super');
let j = await bodyJson(r);
assert(j.results.some(x => x.key === 'facebook_url' && x.value.includes('facebook.com/skyfirstnetwork')), 'facebook setting');
r = await authHit(superSession, '/api/admin/resources/settings/tagline', {
  method:'PATCH', headers:{'content-type':'application/json'}, body:JSON.stringify({ value:'Giáo dục · Phát triển người trẻ · Cộng đồng' })
});
assert(r.status === 200, 'settings update');

// Create editor + reviewer and verify server-side RBAC.
for (const account of [
  { name:'QA Editor', email:'editor@example.com', role:'EDITOR', password:'Strong-Editor-Password-2026!' },
  { name:'QA Reviewer', email:'reviewer@example.com', role:'REVIEWER', password:'Strong-Reviewer-Password-2026!' }
]) {
  r = await authHit(superSession, '/api/admin/admins', {
    method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(account)
  });
  assert(r.status === 201, `create ${account.role}`);
}

const editor = await login('editor@example.com', 'Strong-Editor-Password-2026!');
r = await authHit(editor, '/api/admin/resources/settings');
assert(r.status === 403, 'editor denied settings');
r = await authHit(editor, '/api/admin/resources/pages', {
  method:'POST', headers:{'content-type':'application/json'},
  body:JSON.stringify({ lang:'vi', slug:'qa-editor-draft', title:'QA Editor Draft', body_html:'<p>Draft</p>', status:'draft', public:true })
});
assert(r.status === 201, 'editor creates draft');
j = await bodyJson(r); const editorPageId = j.id;
r = await authHit(editor, '/api/admin/resources/pages', {
  method:'POST', headers:{'content-type':'application/json'},
  body:JSON.stringify({ lang:'vi', slug:'qa-editor-publish-denied', title:'Denied', body_html:'<p>Denied</p>', status:'published', public:true })
});
assert(r.status === 403, 'editor cannot publish');

const reviewer = await login('reviewer@example.com', 'Strong-Reviewer-Password-2026!');
r = await authHit(reviewer, '/api/admin/resources/pages', {
  method:'POST', headers:{'content-type':'application/json'},
  body:JSON.stringify({ lang:'vi', slug:'reviewer-create-denied', title:'Denied', status:'draft', public:true })
});
assert(r.status === 403, 'reviewer cannot create');
r = await authHit(reviewer, `/api/admin/resources/pages/${editorPageId}`, {
  method:'PATCH', headers:{'content-type':'application/json'}, body:JSON.stringify({ status:'published' })
});
assert(r.status === 200, 'reviewer can publish existing draft');
r = await hit('/qa-editor-draft'); assert(r.status === 200, 'reviewer-published page visible');

// Scheduled publishing: future hidden, past visible without a cron job.
r = await authHit(superSession, '/api/admin/resources/pages', {
  method:'POST', headers:{'content-type':'application/json'},
  body:JSON.stringify({ lang:'vi', slug:'qa-future', title:'Future Page', body_html:'<p>Future</p>', status:'published', public:true, scheduled_at:'2099-01-01T00:00:00.000Z' })
});
assert(r.status === 201, 'future page create');
r = await hit('/qa-future'); assert(r.status === 404, 'future scheduled page hidden');
r = await authHit(superSession, '/api/admin/resources/pages', {
  method:'POST', headers:{'content-type':'application/json'},
  body:JSON.stringify({ lang:'vi', slug:'qa-past', title:'Past Page', body_html:'<p>Past</p>', status:'published', public:true, scheduled_at:'2020-01-01T00:00:00.000Z' })
});
assert(r.status === 201, 'past page create');
r = await hit('/qa-past'); assert(r.status === 200, 'past scheduled page visible');

// R2 upload + protected public serving route.
const png = new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,0]);
r = await authHit(editor, '/api/admin/media/upload', {
  method:'POST', headers:{'content-type':'image/png','x-filename':'qa.png','content-length':String(png.byteLength)}, body:png
});
assert(r.status === 201, 'editor media upload');
j = await bodyJson(r);
r = await hit(j.url); assert(r.status === 200, 'public R2 media route');
assert((await r.arrayBuffer()).byteLength === png.byteLength, 'media byte integrity');

// Issuer keys are shown once, and certificate finalization is issuer-bound.
r = await authHit(superSession, '/api/admin/issuer-keys', {
  method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ issuer_name:'Sky First Test Issuer A' })
});
assert(r.status === 201, 'issuer A create'); const issuerA = await bodyJson(r);
r = await authHit(superSession, '/api/admin/issuer-keys', {
  method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ issuer_name:'Sky First Test Issuer B' })
});
assert(r.status === 201, 'issuer B create'); const issuerB = await bodyJson(r);
r = await hit('/api/certificates/issue', {
  method:'POST', headers:{'content-type':'application/json','authorization':`Bearer ${issuerA.key}`},
  body:JSON.stringify({ recipient_name:'Nguyễn Văn QA', title:'Giấy chứng nhận QA', issue_date:'2026-09-04', issuing_system:'Spoofed external system' })
});
assert(r.status === 201, 'certificate issue'); const cert = await bodyJson(r);
r = await hit(`/api/certificates/${encodeURIComponent(cert.certificate_code)}/finalize`, {
  method:'POST', headers:{'content-type':'application/json','authorization':`Bearer ${issuerB.key}`}, body:JSON.stringify({ qr_url:'https://skyfirst.io.vn/qr/other.png' })
});
assert(r.status === 403, 'other issuer cannot finalize');
r = await hit(`/api/certificates/${encodeURIComponent(cert.certificate_code)}/finalize`, {
  method:'POST', headers:{'content-type':'application/json','authorization':`Bearer ${issuerA.key}`}, body:JSON.stringify({ qr_url:'https://skyfirst.io.vn/qr/qa.png' })
});
assert(r.status === 200, 'owner issuer finalizes');
r = await hit(`/api/certificates/verify?q=${encodeURIComponent(cert.certificate_code)}`);
j = await bodyJson(r); assert(j.found && j.certificate.status === 'valid', 'certificate verifies valid');
assert(j.certificate.issuing_system === 'Sky First Test Issuer A', 'central verification derives source from issuer key');
assert(!('email' in j.certificate) && !('phone' in j.certificate), 'verification response excludes sensitive contact data');

// Human-managed UI translations can be published without changing source code.
r = await authHit(superSession, '/api/admin/resources/ui_strings', {
  method:'POST', headers:{'content-type':'application/json'},
  body:JSON.stringify({ lang:'en', key:'qa.footer.explore', value:'Explore', status:'published' })
});
assert(r.status === 201, 'English UI string publish');

// Default language can change; fallback remains configured Vietnamese until translations are published.
r = await authHit(superSession, '/api/admin/resources/languages/en', {
  method:'PATCH', headers:{'content-type':'application/json'}, body:JSON.stringify({ is_default:true, enabled:true })
});
assert(r.status === 200, 'change default language');
r = await hit('/gioi-thieu');
assert(r.status === 200, 'CMS page after default language change');
let text = await r.text();
assert(text.includes('<html lang="en"'), 'default language applied');
assert(!text.includes('ngôn ngữ dự phòng'), 'published English page does not show fallback notice');
assert(text.includes('What is Sky First Network?'), 'published English page applied');
assert(text.includes('href="/vi/gioi-thieu"') || text.includes('value="vi"'), 'Vietnamese language remains reachable');

// Sitemap and public brand rules.
r = await hit('/sitemap.xml'); assert(r.status === 200, 'sitemap status'); text = await r.text();
assert(!text.includes('/qa-future'), 'future page absent from sitemap');
r = await hit('/vi/gioi-thieu'); assert(r.status === 200, 'Vietnamese localized route'); text = await r.text();
assert(text.includes('SKY FIRST NETWORK'), 'public brand present');
assert(!/\bSFN\b/.test(text), 'public page does not expose forbidden acronym');
assert(text.includes('facebook.com/skyfirstnetwork') && text.includes('instagram.com/sfn.network'), 'confirmed social URLs rendered');
r = await hit('/en/tra-cuu'); assert(r.status === 200, 'English central lookup route'); text = await r.text();
assert(text.includes('Achievements &amp; certificates lookup') || text.includes('Achievements & certificates lookup'), 'English central lookup interface');

console.log('PRODUCTION BEHAVIOR PASS: RBAC, settings/SEO, scheduled publishing, R2 media, issuer-bound certificates, configurable default/fallback language, sitemap and public brand rules.');
