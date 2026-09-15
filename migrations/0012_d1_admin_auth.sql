CREATE TABLE IF NOT EXISTS website_admin_users (
  uid TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK(role IN ('developer','admin','editor')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','disabled')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login TEXT
);
CREATE INDEX IF NOT EXISTS idx_website_admin_users_email ON website_admin_users(email);
