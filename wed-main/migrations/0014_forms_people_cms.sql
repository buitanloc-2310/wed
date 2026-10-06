CREATE TABLE IF NOT EXISTS website_forms (
 id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'draft', fields_json TEXT NOT NULL DEFAULT '[]', settings_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS website_form_submissions (
 id TEXT PRIMARY KEY, form_id TEXT NOT NULL, application_code TEXT NOT NULL UNIQUE, applicant_name TEXT, applicant_email TEXT, answers_json TEXT NOT NULL DEFAULT '{}', status TEXT NOT NULL DEFAULT 'received', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(form_id) REFERENCES website_forms(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_website_forms_status ON website_forms(status,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_website_form_submissions_form ON website_form_submissions(form_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_website_form_submissions_code ON website_form_submissions(application_code);
CREATE TABLE IF NOT EXISTS website_people (
 id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, title TEXT NOT NULL DEFAULT '', bio TEXT NOT NULL DEFAULT '', image_url TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '', public_profile INTEGER NOT NULL DEFAULT 0, allow_index INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'draft', payload TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_website_people_public ON website_people(public_profile,status,updated_at DESC);
