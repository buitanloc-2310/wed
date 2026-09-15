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

CREATE TABLE IF NOT EXISTS website_cms_documents (
  collection_name TEXT NOT NULL,
  doc_id TEXT NOT NULL,
  data_json TEXT NOT NULL,
  is_published INTEGER NOT NULL DEFAULT 0 CHECK(is_published IN (0,1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT,
  PRIMARY KEY(collection_name, doc_id)
);
CREATE INDEX IF NOT EXISTS idx_cms_collection_public ON website_cms_documents(collection_name,is_published,updated_at);
