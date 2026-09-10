export async function onRequestGet(context) {
  if (!context.env.MEDIA) return new Response('Media unavailable', { status: 503 });
  const path = Array.isArray(context.params.path) ? context.params.path.join('/') : String(context.params.path || '');
  if (!path || !path.startsWith('website/')) return new Response('Not found', { status: 404 });
  const object = await context.env.MEDIA.get(path);
  if (!object) return new Response('Not found', { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  headers.set('x-content-type-options', 'nosniff');
  return new Response(object.body, { headers });
}
