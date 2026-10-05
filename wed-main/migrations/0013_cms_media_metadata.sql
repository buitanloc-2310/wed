-- Additive CMS and media metadata; preserves existing content and uploads.
CREATE TABLE IF NOT EXISTS website_cms_documents (
 collection_name TEXT NOT NULL, doc_id TEXT NOT NULL, data_json TEXT NOT NULL,
 is_published INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL, updated_by TEXT,
 PRIMARY KEY(collection_name,doc_id)
);
CREATE INDEX IF NOT EXISTS idx_cms_collection_public ON website_cms_documents(collection_name,is_published,updated_at);
CREATE TABLE IF NOT EXISTS website_cms_collections(collection_name TEXT PRIMARY KEY,initialized_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS website_cms_deleted(collection_name TEXT NOT NULL,doc_id TEXT NOT NULL,deleted_at TEXT NOT NULL,PRIMARY KEY(collection_name,doc_id));
CREATE TABLE IF NOT EXISTS website_media_metadata(key TEXT PRIMARY KEY,alt TEXT NOT NULL DEFAULT '',caption TEXT NOT NULL DEFAULT '',updated_at TEXT NOT NULL);
