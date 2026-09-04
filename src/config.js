export const APP = Object.freeze({
  name: 'SKY FIRST NETWORK',
  organization: 'Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First',
  url: 'https://skyfirst.io.vn',
  defaultLang: 'vi',
  sessionCookie: 'skyfirst_admin_session',
  sessionHours: 8,
  maxUploadBytes: 15 * 1024 * 1024,
  allowedUploads: new Set(['image/jpeg','image/png','image/webp','application/pdf'])
});
export const ROLES = ['SUPER_ADMIN','ADMIN','EDITOR','REVIEWER'];
