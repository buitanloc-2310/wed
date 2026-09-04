PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  group_name TEXT NOT NULL DEFAULT 'general',
  value_type TEXT NOT NULL DEFAULT 'text',
  is_public INTEGER NOT NULL DEFAULT 1 CHECK(is_public IN (0,1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'ltr' CHECK(direction IN ('ltr','rtl')),
  enabled INTEGER NOT NULL DEFAULT 1 CHECK(enabled IN (0,1)),
  is_default INTEGER NOT NULL DEFAULT 0 CHECK(is_default IN (0,1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'EDITOR' CHECK(role IN ('SUPER_ADMIN','ADMIN','EDITOR','REVIEWER')),
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS site_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  csrf_token TEXT NOT NULL,
  admin_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(admin_id) REFERENCES site_admins(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  public INTEGER NOT NULL DEFAULT 1 CHECK(public IN (0,1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  translation_group TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'vi',
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  body_html TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','pending','published','hidden','archived')),
  public INTEGER NOT NULL DEFAULT 1 CHECK(public IN (0,1)),
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  published_at TEXT,
  scheduled_at TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lang,slug),
  FOREIGN KEY(lang) REFERENCES site_languages(code),
  FOREIGN KEY(created_by) REFERENCES site_admins(id),
  FOREIGN KEY(updated_by) REFERENCES site_admins(id)
);

CREATE TABLE IF NOT EXISTS site_units (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  official_name TEXT NOT NULL,
  english_name TEXT,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  contact_email TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive','archived')),
  public INTEGER NOT NULL DEFAULT 1 CHECK(public IN (0,1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  translation_group TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'vi',
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  body_html TEXT NOT NULL DEFAULT '',
  featured_image TEXT,
  category_id INTEGER,
  unit_id INTEGER,
  author_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','pending','published','hidden','archived')),
  public INTEGER NOT NULL DEFAULT 1 CHECK(public IN (0,1)),
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  published_at TEXT,
  scheduled_at TEXT,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lang,slug),
  FOREIGN KEY(lang) REFERENCES site_languages(code),
  FOREIGN KEY(category_id) REFERENCES categories(id),
  FOREIGN KEY(unit_id) REFERENCES site_units(id),
  FOREIGN KEY(created_by) REFERENCES site_admins(id),
  FOREIGN KEY(updated_by) REFERENCES site_admins(id)
);

CREATE TABLE IF NOT EXISTS programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  body_html TEXT,
  unit_id INTEGER,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK(status IN ('upcoming','open','running','closed','ended','archived')),
  registration_url TEXT,
  start_date TEXT,
  end_date TEXT,
  featured_image TEXT,
  public INTEGER NOT NULL DEFAULT 1 CHECK(public IN (0,1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(unit_id) REFERENCES site_units(id)
);

CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  audience TEXT,
  objective TEXT,
  format TEXT,
  schedule_text TEXT,
  duration_text TEXT,
  unit_id INTEGER,
  program_id INTEGER,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK(status IN ('upcoming','open','running','closed','ended','archived')),
  registration_url TEXT,
  public INTEGER NOT NULL DEFAULT 1 CHECK(public IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(unit_id) REFERENCES site_units(id),
  FOREIGN KEY(program_id) REFERENCES programs(id)
);

CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  body_html TEXT,
  location_text TEXT,
  start_at TEXT,
  end_at TEXT,
  unit_id INTEGER,
  featured_image TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK(status IN ('upcoming','running','ended','archived')),
  public INTEGER NOT NULL DEFAULT 1 CHECK(public IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(unit_id) REFERENCES site_units(id)
);

CREATE TABLE IF NOT EXISTS team_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  unit_id INTEGER,
  bio TEXT,
  photo_url TEXT,
  public INTEGER NOT NULL DEFAULT 0 CHECK(public IN (0,1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(unit_id) REFERENCES site_units(id)
);

CREATE TABLE IF NOT EXISTS site_partners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  relationship_status TEXT NOT NULL DEFAULT 'current' CHECK(relationship_status IN ('current','historical','pending','archived')),
  public INTEGER NOT NULL DEFAULT 0 CHECK(public IN (0,1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS albums (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  unit_id INTEGER,
  program_id INTEGER,
  activity_id INTEGER,
  cover_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','hidden','archived')),
  public INTEGER NOT NULL DEFAULT 1 CHECK(public IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(unit_id) REFERENCES site_units(id),
  FOREIGN KEY(program_id) REFERENCES programs(id),
  FOREIGN KEY(activity_id) REFERENCES activities(id)
);

CREATE TABLE IF NOT EXISTS site_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  object_key TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  alt_text TEXT,
  caption TEXT,
  album_id INTEGER,
  public INTEGER NOT NULL DEFAULT 1 CHECK(public IN (0,1)),
  uploaded_by INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(album_id) REFERENCES albums(id),
  FOREIGN KEY(uploaded_by) REFERENCES site_admins(id)
);

CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  media_id INTEGER,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','hidden','archived')),
  public INTEGER NOT NULL DEFAULT 1 CHECK(public IN (0,1)),
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(media_id) REFERENCES site_media(id)
);

CREATE TABLE IF NOT EXISTS site_menus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  location TEXT NOT NULL DEFAULT 'header',
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  parent_id INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible INTEGER NOT NULL DEFAULT 1 CHECK(visible IN (0,1)),
  new_tab INTEGER NOT NULL DEFAULT 0 CHECK(new_tab IN (0,1)),
  lang TEXT NOT NULL DEFAULT 'vi',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(parent_id) REFERENCES site_menus(id) ON DELETE CASCADE,
  FOREIGN KEY(lang) REFERENCES site_languages(code)
);

CREATE TABLE IF NOT EXISTS site_portals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  subtitle TEXT,
  url TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','maintenance','hidden','retired')),
  public INTEGER NOT NULL DEFAULT 1 CHECK(public IN (0,1)),
  show_footer INTEGER NOT NULL DEFAULT 1 CHECK(show_footer IN (0,1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_certificates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  certificate_code TEXT NOT NULL UNIQUE,
  verification_token TEXT NOT NULL UNIQUE,
  recipient_name TEXT NOT NULL,
  title TEXT NOT NULL,
  issuer_unit TEXT,
  program_name TEXT,
  role_recognition TEXT,
  issue_date TEXT NOT NULL,
  valid_until TEXT,
  issuing_system TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_qr' CHECK(status IN ('pending_qr','valid','expired','revoked')),
  public_pdf_url TEXT,
  qr_url TEXT,
  revoked_at TEXT,
  revocation_note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK(status != 'valid' OR qr_url IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS issuer_api_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  issuer_name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
  created_by INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_used_at TEXT,
  FOREIGN KEY(created_by) REFERENCES site_admins(id)
);

CREATE TABLE IF NOT EXISTS site_forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  form_type TEXT NOT NULL CHECK(form_type IN ('core_team','volunteer','learner','cooperation','contact')),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  organization TEXT,
  program_id INTEGER,
  message TEXT,
  consent INTEGER NOT NULL DEFAULT 0 CHECK(consent IN (0,1)),
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewing','contacted','resolved','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(program_id) REFERENCES programs(id)
);

CREATE TABLE IF NOT EXISTS site_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id INTEGER,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  metadata TEXT,
  ip_hash TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(admin_id) REFERENCES site_admins(id)
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  window_started_at INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 0
);
