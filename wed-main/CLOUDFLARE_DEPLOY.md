# Hướng Dẫn Triển Khai, Vận Hành & Khôi Phục — Sky First Network (Cloudflare Pages + D1 + R2)

## 1. Cấu hình Bindings trên Cloudflare Pages (`wrangler.jsonc`)
Dự án sử dụng 2 bindings bắt buộc và các biến môi trường bảo mật:
- **D1 Database Binding**: `DB` -> cơ sở dữ liệu `skyfirst-db`
- **R2 Bucket Binding**: `MEDIA` -> bucket lưu trữ tệp `skyfirst-media`
- **Biến môi trường (Secrets / Environment Variables)**:
  - `FIREBASE_PROJECT_ID`: `skyfirstnetwork`
  - `FIREBASE_SERVICE_ACCOUNT_JSON` *(Secret)*: JSON Service Account của Firebase để tạo/đặt lại mật khẩu quản trị viên từ máy chủ.
  - `RESEND_API_KEY` *(Secret, tùy chọn)*: Khóa API dịch vụ gửi thư Resend. Nếu chưa cấu hình, mọi biểu mẫu vẫn lưu bình thường và thư được xếp hàng an toàn ở trạng thái `unconfigured` trong `website_email_outbox`.
  - `MAIL_FROM` *(Tùy chọn)*: Địa chỉ gửi thư định danh, ví dụ `Sky First Network <support@skyfirst.io.vn>`.

## 2. Chạy Migration D1 (An toàn, không làm mất dữ liệu)
Tất cả các câu lệnh SQL trong `migrations/` đều sử dụng `CREATE TABLE IF NOT EXISTS` và `CREATE INDEX IF NOT EXISTS`, tuyệt đối không có `DROP TABLE` hay `TRUNCATE`:
```bash
# Áp dụng schema nền tảng và bảng mở rộng hệ thống (Email Outbox, Revisions, Analytics, Backups)
npx wrangler d1 execute skyfirst-db --remote --file=./migrations/0001_initial_schema.sql
npx wrangler d1 execute skyfirst-db --remote --file=./migrations/0002_system_automation_analytics.sql
```
Ngoài ra, các API `/api/cms`, `/api/forms`, `/api/system` đều tích hợp cơ chế tự khởi tạo bảng và bổ sung cột còn thiếu (`ensureSystemSchema`, `ensure`) ngay khi được gọi.

## 3. Triển khai lên Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy dist --project-name=skyfirst-network
```

## 4. Quy trình Sao lưu & Khôi phục (Rollback)
1. **Sao lưu trực tiếp trong Admin**:
   - Mở `/admin` -> **Trung tâm Cấu hình** -> tab **Sao Lưu & Khôi Phục**.
   - Bấm **+ Tạo bản sao lưu ngay**: Hệ thống xuất toàn bộ `website_cms_documents`, `website_forms`, `website_admin_records` kèm mã băm toàn vẹn **SHA-256** vào bảng `website_backups`.
2. **Khôi phục an toàn (Rollback)**:
   - Chọn bản sao lưu muốn khôi phục trong danh sách -> nhập chính xác cụm từ xác nhận `KHOI_PHUC_DU_LIEU`.
   - Hệ thống kiểm tra mã băm SHA-256 trước khi khôi phục và ghi nhật ký vào `website_admin_audit`.
3. **Khôi phục từng trang / bài viết / cấu hình**:
   - Trong **Chỉnh sửa Website** hoặc qua API `/api/system?action=revisions`, quản trị viên có thể xem lịch sử phiên bản (`website_revisions`) và khôi phục về bất kỳ phiên bản trước đó nào (hệ thống tự động tạo một bản lưu của trạng thái hiện tại trước khi khôi phục).
