export const one = async (db, sql, ...values) => (await db.prepare(sql).bind(...values).first()) || null;
export const all = async (db, sql, ...values) => (await db.prepare(sql).bind(...values).all()).results || [];
export const run = async (db, sql, ...values) => db.prepare(sql).bind(...values).run();
export async function settings(db) { const rows = await all(db, 'SELECT key,value FROM sky_settings'); return Object.fromEntries(rows.map(r => [r.key,r.value])); }
export async function setting(db, key, fallback = '') { return (await one(db, 'SELECT value FROM sky_settings WHERE key=?', key))?.value ?? fallback; }
export async function setSetting(db, key, value) { return run(db, 'INSERT INTO sky_settings(key,value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP', key, value); }
