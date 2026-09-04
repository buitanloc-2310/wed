# Release notes — Production V2.3.0 — 2026-09-04

- Xây lại từ prototype/index-based sang Worker modular.
- 35 trang public CMS seed từ bản nội dung đã duyệt.
- 20 ngôn ngữ + default/fallback configurable + UI string CMS.
- Admin CMS + First-run SUPER ADMIN + RBAC + CSRF + audit.
- Menu/Footer/Portal/Contact/SEO quản lý từ D1.
- Scheduled publishing không cần cron.
- R2 media upload/serve có kiểm tra MIME và kích thước thực.
- GCN issuer-bound, token/code unique, QR finalize và revoke-preserving history.
- Separate public form flows: Core Team, Tình nguyện viên, Người học, Hợp tác, Liên hệ.
- Legacy compatibility giữ nguyên các bảng prototype cũ.
- Sửa triệt để kiến trúc routing gây redirect loop ở bản trước.

- Hotfix deployment: tự áp dụng D1 remote migrations trong `npm run deploy`; thêm `/api/health/db` để chẩn đoán binding/schema mà không lộ dữ liệu.

## Official homepage integration
- `public/index.html` is the approved primary homepage.
- `/` and `/index.html` serve the same official index through the Worker.
- Admin, API, D1, R2, certificate and CMS routes remain available.
- Official Facebook, Instagram and TikTok labels are clickable links.
- The language selector is embedded in the official index.

## I18N hotfix
- Chuyển dịch tự động từ browser trực tiếp sang same-origin `/api/translate`.
- Thêm CORS cho INDEX độc lập và cache server-side.
- Giữ 20 ngôn ngữ và fallback an toàn về Tiếng Việt.
