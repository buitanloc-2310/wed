# ARCHITECTURE

Production V2 tách Worker theo các lớp:
- `routes/`: public, admin, auth, certificate, media, system.
- `repositories/`: truy cập D1.
- `services/`: i18n, public context, certificate, media, audit.
- `middleware/`: auth/RBAC, rate-limit, security headers.
- `views/`: render HTML public/Admin shell.
- `public/assets/`: CSS, JavaScript trình duyệt và logo chính thức.
- `migrations/`: schema/seed/index/hardening/i18n UI strings.
- `tests/`: schema integrity, legacy compatibility, runtime smoke và production behavior.

Worker là routing authority; Static Assets chỉ phục vụ `/assets/*`, tránh vòng redirect `/ ↔ /index.html` của bản thử nghiệm cũ.
