-- Additive migration only: no DROP/DELETE/RESET.
CREATE TABLE IF NOT EXISTS website_comments (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','hidden')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_website_comments_article_status ON website_comments(article_id, status, created_at);

CREATE TABLE IF NOT EXISTS website_contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  topic TEXT NOT NULL DEFAULT 'Liên hệ chung',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewed','closed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_website_contacts_status_created ON website_contacts(status, created_at);

CREATE TABLE IF NOT EXISTS website_registrations (
  id TEXT PRIMARY KEY,
  application_code TEXT NOT NULL UNIQUE,
  program_id TEXT NOT NULL,
  program_title TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  organization TEXT NOT NULL,
  birth_year TEXT,
  portfolio_url TEXT,
  motivation TEXT NOT NULL,
  consent INTEGER NOT NULL DEFAULT 0 CHECK (consent IN (0,1)),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewing','accepted','rejected','closed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_website_registrations_program_created ON website_registrations(program_id, created_at);
CREATE INDEX IF NOT EXISTS idx_website_registrations_status_created ON website_registrations(status, created_at);
