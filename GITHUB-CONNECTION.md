# Kết nối GitHub và Cloudflare

1. Tạo repository GitHub trống, sau đó upload toàn bộ mã nguồn vào nhánh `main`.
2. Tại repository, vào **Settings → Secrets and variables → Actions**.
3. Tạo hai Repository secrets:
   - `CLOUDFLARE_API_TOKEN`: API token Cloudflare có quyền Workers Scripts Edit, D1 Edit và R2 Edit cho tài khoản chứa dự án.
   - `CLOUDFLARE_ACCOUNT_ID`: Account ID Cloudflare của Sky First.
4. Push lên nhánh `main`. GitHub Actions tự chạy kiểm tra, áp dụng D1 migrations và deploy Worker.

Không đưa API token, mật khẩu hoặc secret vào mã nguồn hay file `.env` được commit.
