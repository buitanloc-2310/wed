import { b64url } from './escape.js';
const encoder = new TextEncoder();
export async function passwordHash(password, salt = crypto.getRandomValues(new Uint8Array(16))) {
  const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name:'PBKDF2', salt, iterations:210000, hash:'SHA-256' }, material, 256);
  return `pbkdf2$210000$${b64url(salt)}$${b64url(bits)}`;
}
export async function verifyPassword(password, stored) {
  const [kind, iterations, salt64, hash64] = String(stored).split('$'); if (kind !== 'pbkdf2') return false;
  const decode = v => Uint8Array.from(atob(v.replaceAll('-','+').replaceAll('_','/')), c => c.charCodeAt(0));
  const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name:'PBKDF2', salt:decode(salt64), iterations:Number(iterations), hash:'SHA-256' }, material, 256);
  return b64url(bits) === hash64;
}
export const csp = "default-src 'self'; img-src 'self' https://img.vietqr.io data:; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";
