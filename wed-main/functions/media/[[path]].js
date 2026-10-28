export async function onRequestGet(context) {
  if (!context.env.MEDIA) return new Response('Media unavailable', { status: 503 });
  const path = Array.isArray(context.params.path)
    ? context.params.path.join('/')
    : String(context.params.path || '');
  if (
    !path ||
    path.includes('..') ||
    (!path.startsWith('website/') && !path.startsWith('form-submissions/'))
  ) {
    return new Response('Not found', { status: 404 });
  }

  const rangeHeader = context.request.headers.get('range');
  let r2Options = undefined;
  let rangeStart = 0;
  let rangeEnd = undefined;
  if (rangeHeader && /^bytes=\d+-\d*$/.test(rangeHeader.trim())) {
    const [startStr, endStr] = rangeHeader.trim().slice(6).split('-');
    rangeStart = Number(startStr);
    rangeEnd = endStr ? Number(endStr) : undefined;
    if (Number.isFinite(rangeStart) && rangeStart >= 0) {
      r2Options =
        rangeEnd !== undefined && rangeEnd >= rangeStart
          ? { range: { offset: rangeStart, length: rangeEnd - rangeStart + 1 } }
          : { range: { offset: rangeStart } };
    }
  }

  const object = await context.env.MEDIA.get(path, r2Options);
  if (!object) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  if (object.httpEtag) headers.set('etag', object.httpEtag);
  headers.set(
    'cache-control',
    path.startsWith('form-submissions/') ? 'private, max-age=3600' : 'public, max-age=31536000, immutable'
  );
  headers.set('x-content-type-options', 'nosniff');
  headers.set('accept-ranges', 'bytes');

  const contentType = object.httpMetadata?.contentType || '';
  if (contentType === 'image/svg+xml') {
    headers.set('content-security-policy', "default-src 'none'; style-src 'unsafe-inline'; sandbox");
  }
  if (contentType === 'application/pdf' || contentType.startsWith('video/')) {
    headers.set('content-disposition', 'inline');
  }
  if (object.httpEtag && context.request.headers.get('if-none-match') === object.httpEtag) {
    return new Response(null, { status: 304, headers });
  }
  if (r2Options && typeof object.size === 'number') {
    const actualEnd = rangeEnd !== undefined ? Math.min(rangeEnd, object.size - 1) : object.size - 1;
    headers.set('content-range', `bytes ${rangeStart}-${actualEnd}/${object.size}`);
    headers.set('content-length', String(Math.max(0, actualEnd - rangeStart + 1)));
    return new Response(object.body, { status: 206, headers });
  }
  return new Response(object.body, { headers });
}

export async function onRequestHead(context) {
  const response = await onRequestGet(context);
  return new Response(null, { status: response.status, headers: response.headers });
}
