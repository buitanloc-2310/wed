from pathlib import Path
import json, re, sqlite3, sys

ROOT = Path(__file__).resolve().parents[1]
errors = []

def require(path):
    if not (ROOT / path).exists():
        errors.append(f'Missing: {path}')

for path in [
    'functions/api/media/upload.js',
    'functions/api/media/index.js',
    'functions/media/[[path]].js',
    'functions/api/comments/index.js',
    'functions/api/contact/index.js',
    'functions/api/registrations/index.js',
    'migrations/0010_website_media_comments_contacts.sql',
    'src/components/NewsComments.tsx',
    'src/components/admin/AdminRemoteDataManager.tsx',
    'src/data/officialContent2026.ts',
    'public/brand/sky-first-network-web.png',
    'public/brand/the-sky-first-english-club-web.png',
    'public/brand/nha-han-ngu-web.jpg',
]: require(path)

try:
    json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))
except Exception as exc:
    errors.append(f'package.json invalid: {exc}')

try:
    wrangler = (ROOT / 'wrangler.jsonc').read_text(encoding='utf-8')
    wrangler = re.sub(r'//.*', '', wrangler)
    json.loads(wrangler)
except Exception as exc:
    errors.append(f'wrangler.jsonc invalid: {exc}')

try:
    sql = (ROOT / 'migrations/0010_website_media_comments_contacts.sql').read_text(encoding='utf-8')
    executable = '\n'.join(line for line in sql.splitlines() if not line.lstrip().startswith('--'))
    if re.search(r'\b(DROP|TRUNCATE|DELETE\s+FROM)\b', executable, re.I):
        errors.append('Migration contains destructive SQL')
    db = sqlite3.connect(':memory:')
    db.executescript(sql)
    tables = {r[0] for r in db.execute("select name from sqlite_master where type='table'")}
    for table in ('website_comments', 'website_contacts', 'website_registrations'):
        if table not in tables: errors.append(f'Migration does not create {table}')
except Exception as exc:
    errors.append(f'Migration invalid: {exc}')

src = '\n'.join(
    p.read_text(encoding='utf-8', errors='ignore')
    for p in (ROOT / 'src').rglob('*')
    if p.suffix in {'.ts', '.tsx'}
)
for bad in ('images.unsplash.com', '/favicon.png'):
    if bad in src: errors.append(f'Unexpected placeholder/broken asset reference: {bad}')

ctx = (ROOT / 'src/context/DataContext.tsx').read_text(encoding='utf-8')
official = (ROOT / 'src/data/officialContent2026.ts').read_text(encoding='utf-8')
slugs = set(re.findall(r"slug\s*:\s*['\"]([^'\"]+)['\"]", ctx + official))
nav = set(re.findall(r"page:'custom-page',slug:'([^']+)'", ctx))
footer = set(re.findall(r"url:'/page/([^']+)'", ctx))
for slug in sorted((nav | footer) - slugs): errors.append(f'Broken configured page slug: {slug}')

if errors:
    print('RELEASE CHECK FAILED')
    for err in errors: print('-', err)
    sys.exit(1)

print('RELEASE CHECK PASSED')
print(f'Configured page slugs checked: {len(nav | footer)}')
print('Additive D1 migration checked: OK')
print('Critical media/comments/contact/registration files: OK')
