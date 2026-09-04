# Security notes

- Không có mật khẩu mặc định, API key hoặc secret hard-code trong source/ZIP.
- Mật khẩu quản trị dùng PBKDF2 SHA-256, salt ngẫu nhiên, 310.000 iterations.
- Session cookie: HttpOnly + Secure + SameSite=Strict; D1 chỉ lưu SHA-256 của session token.
- Admin API thay đổi dữ liệu yêu cầu CSRF token.
- RBAC được kiểm tra ở API, không chỉ ẩn nút trên giao diện.
- SUPER ADMIN quản trị tài khoản/issuer key; ADMIN quản trị hệ thống; EDITOR soạn nội dung; REVIEWER rà soát/xuất bản theo phạm vi.
- Login, First-run setup, đổi mật khẩu, form public và certificate issuance có fixed-window rate limit trong D1.
- Upload chỉ nhận JPEG/PNG/WebP/PDF, tối đa 15 MB và kiểm tra kích thước thực của body.
- R2 object chỉ được trả qua Worker nếu bản ghi `site_media.public=1`.
- Certificate issuer key chỉ lưu hash; khóa thô chỉ hiển thị một lần khi tạo.
- Certificate finalize bị ràng buộc với issuer đã phát hành; revoke không xóa bản ghi.
- Public certificate lookup không trả email, điện thoại, địa chỉ, ngày sinh, tài khoản quản trị hoặc issuer key.
- Audit log lưu hành động quản trị và hash IP, không lưu IP thô.
- CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` được áp dụng ở response layer.
- Form public có rate-limit và honeypot; chỉ thu thập dữ liệu cần thiết cho từng luồng.
