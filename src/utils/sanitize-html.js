export function sanitizeHtml(input=''){
  let s=String(input);
  s=s.replace(/<\s*(script|iframe|object|embed|form|base|meta|link)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,'');
  s=s.replace(/<\s*(script|iframe|object|embed|base|meta|link)[^>]*\/?\s*>/gi,'');
  s=s.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,'');
  s=s.replace(/\s+(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi,' $1="#"');
  s=s.replace(/\s+style\s*=\s*(["'])[^"']*expression\s*\([^"']*\)[^"']*\1/gi,'');
  return s;
}
