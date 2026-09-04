export function escapeHtml(value='') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
export function escapeAttr(value='') { return escapeHtml(value).replace(/`/g,'&#96;'); }
