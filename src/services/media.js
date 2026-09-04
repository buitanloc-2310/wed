import { APP } from '../config.js';
import { randomToken } from '../utils/crypto.js';

export async function uploadMedia(request, env, admin) {
  const type = (request.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  if (!APP.allowedUploads.has(type)) return { error: 'UNSUPPORTED_MEDIA', status: 415 };

  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > APP.maxUploadBytes) return { error: 'FILE_TOO_LARGE', status: 413 };

  const bytes = await request.arrayBuffer();
  if (bytes.byteLength === 0) return { error: 'EMPTY_FILE', status: 400 };
  if (bytes.byteLength > APP.maxUploadBytes) return { error: 'FILE_TOO_LARGE', status: 413 };

  const original = (request.headers.get('x-filename') || 'upload')
    .replace(/[^a-zA-Z0-9._ -]/g, '_')
    .slice(0, 160);
  const ext = type === 'image/jpeg' ? '.jpg' : type === 'image/png' ? '.png' : type === 'image/webp' ? '.webp' : '.pdf';
  const key = `uploads/${new Date().toISOString().slice(0, 10)}/${randomToken(18)}${ext}`;

  await env.MEDIA.put(key, bytes, { httpMetadata: { contentType: type } });
  const result = await env.DB.prepare(
    'INSERT INTO site_media(object_key,filename,mime_type,size_bytes,uploaded_by) VALUES(?,?,?,?,?)'
  ).bind(key, original, type, bytes.byteLength, admin.id).run();

  return { id: result.meta.last_row_id, key, url: '/media/' + key, size_bytes: bytes.byteLength, status: 201 };
}
