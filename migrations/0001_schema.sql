-- SKY FIRST NETWORK: independent tables, intentionally prefixed to avoid legacy collisions.
CREATE TABLE IF NOT EXISTS sky_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sky_pages (slug TEXT NOT NULL, locale TEXT NOT NULL, title TEXT NOT NULL, summary TEXT NOT NULL DEFAULT '', body_html TEXT NOT NULL DEFAULT '', updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(slug, locale));
CREATE TABLE IF NOT EXISTS sky_topics (slug TEXT NOT NULL, locale TEXT NOT NULL, number INTEGER NOT NULL, question TEXT NOT NULL, answer_html TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(slug, locale));
CREATE TABLE IF NOT EXISTS sky_posts (id TEXT PRIMARY KEY, locale TEXT NOT NULL, title TEXT NOT NULL, excerpt TEXT NOT NULL DEFAULT '', body_html TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft', published_at TEXT, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sky_portals (slug TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, url TEXT NOT NULL, target_blank INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS sky_submissions (id TEXT PRIMARY KEY, form_type TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL DEFAULT '', organisation TEXT NOT NULL DEFAULT '', subject TEXT NOT NULL DEFAULT '', department TEXT NOT NULL DEFAULT '', message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sky_certificates (code TEXT PRIMARY KEY, holder_name TEXT NOT NULL, achievement TEXT NOT NULL, issuer_key TEXT NOT NULL, issuer_name TEXT NOT NULL, issued_at TEXT NOT NULL, expires_at TEXT, status TEXT NOT NULL DEFAULT 'pending', public_note TEXT NOT NULL DEFAULT '', updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sky_issuer_keys (issuer_key TEXT PRIMARY KEY, issuer_name TEXT NOT NULL, enabled INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sky_admins (email TEXT PRIMARY KEY, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'editor', active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sky_sessions (id TEXT PRIMARY KEY, admin_email TEXT NOT NULL, csrf_token TEXT NOT NULL, expires_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sky_media (id TEXT PRIMARY KEY, r2_key TEXT NOT NULL UNIQUE, filename TEXT NOT NULL, content_type TEXT NOT NULL, bytes INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sky_audit (id TEXT PRIMARY KEY, actor TEXT NOT NULL, action TEXT NOT NULL, target TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_sky_topics_locale_number ON sky_topics(locale, number);
CREATE INDEX IF NOT EXISTS idx_sky_posts_locale_status_published ON sky_posts(locale, status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_sky_submissions_status_created ON sky_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sky_certificates_status ON sky_certificates(status);
PRAGMA optimize;
