export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
export const cleanText = (value, length = 5000) => String(value ?? '').trim().slice(0, length);
export const id = () => crypto.randomUUID();
export const b64url = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
export const randomToken = async () => b64url(await crypto.subtle.digest('SHA-256', crypto.getRandomValues(new Uint8Array(32))));
export const safePath = value => /^\/[a-z0-9\-_/]*$/i.test(value || '') ? value : '/home';
