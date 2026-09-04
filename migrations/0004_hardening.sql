ALTER TABLE site_certificates ADD COLUMN issuer_key_id INTEGER REFERENCES issuer_api_keys(id);
CREATE INDEX IF NOT EXISTS idx_cert_issuer_key ON site_certificates(issuer_key_id,created_at);
CREATE INDEX IF NOT EXISTS idx_pages_schedule ON pages(status,public,scheduled_at);
CREATE INDEX IF NOT EXISTS idx_posts_schedule ON posts(status,public,scheduled_at);
