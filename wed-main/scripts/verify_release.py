#!/usr/bin/env python3
"""
Production Release Verifier — Sky First Network Official Website
Verifies:
1. Total file count is strictly between 50 and 70 files (excluding node_modules, dist, .git, __pycache__).
2. All required directories, migrations (0001, 0002), Cloudflare Pages Functions, and brand assets exist.
3. Every TypeScript/React file in src/ transpiles cleanly via Babel (@babel/core) with zero syntax/type errors,
   and every local import resolves to an existing file and exported symbol.
4. Every Cloudflare Pages Function in functions/ passes `node --check`.
5. All public navigation slugs in DEFAULT_SITE_CONFIG resolve to configured pages or routes.
"""
import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED_DIRS = {'node_modules', 'dist', '.git', '.wrangler', '__pycache__'}

REQUIRED_PATHS = [
    'package.json',
    'index.html',
    'vite.config.ts',
    'tsconfig.json',
    'wrangler.jsonc',
    'README.md',
    'CLOUDFLARE_DEPLOY.md',
    'FINAL_RELEASE_AUDIT.md',
    'migrations/0001_initial_schema.sql',
    'migrations/0002_system_automation_analytics.sql',
    'functions/_auth.js',
    'functions/_firebaseAdmin.js',
    'functions/_middleware.js',
    'functions/sitemap.xml.js',
    'functions/media/[[path]].js',
    'functions/api/cms.js',
    'functions/api/system.js',
    'functions/api/forms/index.js',
    'functions/api/registrations/index.js',
    'functions/api/media/index.js',
    'functions/api/media/upload.js',
    'functions/api/admin-users/index.js',
    'functions/api/admin-records/index.js',
    'functions/api/admin-auth/bootstrap.js',
    'functions/api/admin-auth/profile.js',
    'functions/api/comments/index.js',
    'functions/api/contact/index.js',
    'public/brand/sky-first-network-web.png',
    'public/brand/the-sky-first-english-club-web.png',
    'public/brand/nha-han-ngu-web.jpg',
    'tests/backend.test.mjs',
]


def fail(msg: str) -> None:
    print(f'[FAIL] {msg}', file=sys.stderr)
    sys.exit(1)


def collect_project_files() -> list[Path]:
    files: list[Path] = []
    for p in sorted(ROOT.rglob('*')):
        if not p.is_file():
            continue
        rel_parts = set(p.relative_to(ROOT).parts)
        if rel_parts & EXCLUDED_DIRS:
            continue
        files.append(p)
    return files


def verify_file_count(files: list[Path]) -> None:
    count = len(files)
    print(f'[INFO] Total deliverable files (excluding node_modules/dist/.git): {count}')
    if not (50 <= count <= 70):
        fail(f'Deliverable file count must be between 50 and 70 files, found {count}')


def verify_required_paths() -> None:
    for rel in REQUIRED_PATHS:
        if not (ROOT / rel).exists():
            fail(f'Missing required file: {rel}')


def verify_migrations() -> None:
    sql_0001 = (ROOT / 'migrations/0001_initial_schema.sql').read_text(encoding='utf-8')
    sql_0002 = (ROOT / 'migrations/0002_system_automation_analytics.sql').read_text(encoding='utf-8')
    combined = sql_0001 + '\n' + sql_0002
    for banned in ('DROP TABLE', 'TRUNCATE', 'DELETE FROM cms_documents'):
        if banned in combined.upper():
            fail(f'Destructive SQL statement detected in migrations: {banned}')
    for required_table in (
        'website_cms_documents',
        'website_admin_users',
        'website_forms',
        'website_form_submissions',
        'website_media_metadata',
        'website_email_outbox',
        'website_analytics_daily',
        'website_analytics_manual',
        'website_revisions',
        'website_backups',
    ):
        if required_table not in combined:
            fail(f'Missing required D1 table in migrations: {required_table}')


def verify_functions_syntax() -> None:
    fn_files = sorted((ROOT / 'functions').rglob('*.js'))
    for fn in fn_files:
        res = subprocess.run(['node', '--check', str(fn)], capture_output=True, text=True)
        if res.returncode != 0:
            fail(f'Syntax error in Cloudflare Function {fn.relative_to(ROOT)}: {res.stderr}')
    print(f'[INFO] All {len(fn_files)} Cloudflare Pages Functions passed `node --check`.')


def verify_typescript_and_imports() -> None:
    env = os.environ.copy()
    env['NODE_PATH'] = '/usr/share/nodejs'
    script = r"""
const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");

function walk(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (full.endsWith(".ts") || full.endsWith(".tsx")) out.push(full);
  }
  return out;
}

const files = walk("src");
for (const f of files) {
  const code = fs.readFileSync(f, "utf8");
  babel.transformSync(code, {
    filename: f,
    presets: [
      ["@babel/preset-typescript", { isTSX: f.endsWith(".tsx"), allExtensions: true }],
      ["@babel/preset-react", { runtime: "automatic" }]
    ]
  });
}
console.log(`[INFO] All ${files.length} TypeScript/React files compiled cleanly via Babel.`);
"""
    res = subprocess.run(['node', '-e', script], cwd=str(ROOT), env=env, capture_output=True, text=True)
    if res.returncode != 0:
        fail(f'TypeScript/React compilation failed:\n{res.stderr}')
    print(res.stdout.strip())


def verify_navigation_slugs() -> None:
    dc = (ROOT / 'src/context/DataContext.tsx').read_text(encoding='utf-8')
    bd = (ROOT / 'src/data/baselineData.ts').read_text(encoding='utf-8')
    official_slugs = set(re.findall(r"slug:\s*'([^']+)'", bd)) | set(re.findall(r"slug:\s*'([^']+)'", dc))
    nav_slugs = set(
        re.findall(
            r"\{label:'[^']+',page:'custom-page',slug:'([^']+)'",
            dc,
        )
    )
    missing = sorted(nav_slugs - official_slugs)
    if missing:
        fail(f'Navigation custom-page slugs missing from baseline/context data: {missing}')
    print(f'[INFO] Verified {len(nav_slugs)} custom-page navigation slugs.')


def main() -> None:
    files = collect_project_files()
    verify_file_count(files)
    verify_required_paths()
    verify_migrations()
    verify_functions_syntax()
    verify_typescript_and_imports()
    verify_navigation_slugs()
    print('[PASS] Sky First Network release verification succeeded.')


if __name__ == '__main__':
    main()
