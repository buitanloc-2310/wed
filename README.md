# SKY FIRST NETWORK — Website Production V2

Bản Production V2 được xây lại theo kiến trúc module cho **Cloudflare Workers + Static Assets + D1 + R2**. Public website được render từ dữ liệu CMS; không còn dùng một `index.html` khổng lồ làm lõi ứng dụng.

## Thành phần chính
- Worker chạy trước mọi request (`run_worker_first: true`) để `/`, `/admin`, `/api`, routing đa ngôn ngữ và media đều qua cùng một router kiểm soát.
- Nội dung public được seed vào D1 làm dữ liệu CMS ban đầu; mọi nội dung mới được quản trị và xuất bản từ Admin.
- `/admin` là CMS riêng: First-run SUPER ADMIN, đăng nhập session, CSRF, RBAC, audit log, CRUD module, upload R2, cài đặt/SEO, menu/footer và ngôn ngữ.
- D1 `wed` lưu nội dung, cấu hình, menu, biểu mẫu, GCN, tài khoản và nhật ký.
- R2 `wed` lưu ảnh/PDF; bucket không cần public URL. Worker chỉ phục vụ `/media/*` khi bản ghi media bật công khai.
- Hai ngôn ngữ công khai Việt/Anh được quản lý từ D1; default language và fallback language có thể đổi trong Admin.
- Chuỗi giao diện đa ngôn ngữ được quản lý bằng bảng `site_ui_strings`; không dùng Google Translate tự động.
- Nội dung đặt lịch chỉ xuất hiện khi đến `scheduled_at`, không cần cron riêng.
- `skyfirst.io.vn/tra-cuu` là cổng tra cứu trung tâm cho GCN và thành tích từ mọi website/cổng/app Sky First. GCN dùng mã + token duy nhất, issuer key dạng hash, QR bắt buộc trước trạng thái valid và ràng buộc issuer khi finalize.

## Tài nguyên Cloudflare
- Worker: `wed`
- D1 binding: `DB`
- D1 database: `wed`
- D1 ID: `e08566ab-be0d-49de-8d6a-e884912c765d`
- R2 binding: `MEDIA`
- R2 bucket: `wed`
- Domain chính: `https://skyfirst.io.vn`
- Admin: `https://skyfirst.io.vn/admin`

## Chạy kiểm tra
```bash
npm install
npm run check
```

Bộ QA local gồm:
- syntax toàn bộ JavaScript;
- integrity + seed D1;
- compatibility với các bảng prototype cũ;
- smoke test toàn bộ 35 public routes;
- first-run Admin + login;
- RBAC Editor/Reviewer/Super Admin;
- Footer/Cài đặt & SEO;
- scheduled publishing;
- upload/serve R2 mock;
- issuer-bound certificate issuance/finalize;
- default/fallback language + UI string translation;
- sitemap/robots/public naming rules.

## Deploy
```bash
npm run deploy
# deploy tự chạy D1 migrations remote trước khi đẩy Worker
```

Không có mật khẩu quản trị mặc định. Sau migration/deploy lần đầu, mở `/admin` để tạo SUPER ADMIN đầu tiên. Nội dung thường ngày được cập nhật trong Admin; không cần tạo ZIP/deploy lại chỉ để sửa bài, trang, menu, footer, cổng, ngôn ngữ hoặc dữ liệu CMS.


## Production V2.3 DB hotfix
`npm run deploy` tự chạy `wrangler d1 migrations apply DB --remote` trước `wrangler deploy`. Endpoint `/api/health/db` cho biết D1 binding/schema đã sẵn sàng hay còn thiếu migration.
