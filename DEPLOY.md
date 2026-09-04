# Triển khai Production V2

## Thứ tự an toàn
1. Giải nén ZIP và mở thư mục dự án.
2. Chạy `npm install`.
3. Chạy `npm run check` và chỉ tiếp tục khi toàn bộ QA PASS.
4. Đăng nhập Cloudflare CLI bằng `npx wrangler login` nếu môi trường triển khai chưa đăng nhập.
5. Chạy `npm run deploy`. Lệnh này **tự áp dụng D1 migrations remote trước rồi mới deploy Worker**.
6. Mở `https://<worker>.workers.dev/api/health/db` và xác nhận `{"ok":true,"database":"ready"}`.
7. Mở Worker URL và kiểm tra `/api/health`, `/`, `/admin`, `/tra-cuu`, `/robots.txt`, `/sitemap.xml`.
8. Kiểm tra `https://skyfirst.io.vn` sau khi deployment active.

## Domain
Custom Domain `skyfirst.io.vn` đã gắn với Worker `wed` thì **giữ nguyên**. Không tạo lại A record cũ `103.57.220.206`, không tạo `admin.skyfirst.io.vn`.

## Sau lần deploy đầu
- Mở `/admin` và tạo SUPER ADMIN nếu hệ thống báo First-run setup.
- Thử tạo một Trang ở trạng thái Nháp, xem Preview/public sau khi xuất bản.
- Thử upload một ảnh nhỏ lên Media và mở `/media/*`.
- Kiểm tra Facebook/Instagram, 4 cổng Sky First, language selector và mobile menu.
- Chỉ sử dụng dữ liệu thật sau khi vòng kiểm tra production trên Cloudflare hoàn tất.
