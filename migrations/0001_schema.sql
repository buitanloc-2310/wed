PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  group_name TEXT NOT NULL DEFAULT 'general',
  is_public INTEGER NOT NULL DEFAULT 1 CHECK(is_public IN (0,1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1 CHECK(enabled IN (0,1)),
  is_default INTEGER NOT NULL DEFAULT 0 CHECK(is_default IN (0,1))
);

CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  translation_key TEXT NOT NULL,
  lang TEXT NOT NULL REFERENCES languages(code),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  body_html TEXT NOT NULL DEFAULT '',
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','review','published','hidden','archived')),
  is_public INTEGER NOT NULL DEFAULT 1 CHECK(is_public IN (0,1)),
  published_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lang, slug)
);

CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lang TEXT NOT NULL REFERENCES languages(code),
  location TEXT NOT NULL CHECK(location IN ('header','footer_explore','footer_join','footer_systems')),
  parent_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible INTEGER NOT NULL DEFAULT 1 CHECK(visible IN (0,1)),
  new_tab INTEGER NOT NULL DEFAULT 0 CHECK(new_tab IN (0,1))
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  translation_key TEXT NOT NULL,
  lang TEXT NOT NULL REFERENCES languages(code),
  slug TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Tin Sky First',
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  body_html TEXT NOT NULL DEFAULT '',
  cover_key TEXT,
  author_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','review','published','hidden','archived')),
  is_public INTEGER NOT NULL DEFAULT 1 CHECK(is_public IN (0,1)),
  published_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lang, slug)
);

CREATE TABLE IF NOT EXISTS programmes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  body_html TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK(status IN ('upcoming','open','running','closed','ended','archived')),
  registration_url TEXT,
  starts_at TEXT,
  ends_at TEXT,
  is_public INTEGER NOT NULL DEFAULT 1 CHECK(is_public IN (0,1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  audience TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'ready' CHECK(status IN ('ready','maintenance','hidden')),
  show_header INTEGER NOT NULL DEFAULT 0 CHECK(show_header IN (0,1)),
  show_footer INTEGER NOT NULL DEFAULT 1 CHECK(show_footer IN (0,1)),
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  form_type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organisation TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  consent INTEGER NOT NULL CHECK(consent IN (0,1)),
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','in_progress','resolved','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS issuer_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  issuer_name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TEXT
);

CREATE TABLE IF NOT EXISTS certificates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  issuer_key_id INTEGER NOT NULL REFERENCES issuer_keys(id),
  verification_code TEXT NOT NULL UNIQUE,
  recipient_name TEXT NOT NULL,
  certificate_title TEXT NOT NULL,
  recognition TEXT,
  programme_name TEXT,
  issuer_unit TEXT,
  issued_on TEXT NOT NULL,
  valid_until TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','valid','revoked','expired','test')),
  public_pdf_key TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  object_key TEXT NOT NULL UNIQUE,
  alt_text TEXT NOT NULL DEFAULT '',
  mime_type TEXT NOT NULL,
  bytes INTEGER NOT NULL,
  is_public INTEGER NOT NULL DEFAULT 0 CHECK(is_public IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS pages_public_idx ON pages(lang, slug, status, is_public);
CREATE INDEX IF NOT EXISTS posts_public_idx ON posts(lang, status, is_public, published_at DESC);
CREATE INDEX IF NOT EXISTS certificates_lookup_idx ON certificates(verification_code, status);
CREATE INDEX IF NOT EXISTS submissions_status_idx ON submissions(status, created_at DESC);
