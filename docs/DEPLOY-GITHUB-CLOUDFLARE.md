# Đưa website lên GitHub và Cloudflare

1. Tạo repository trống trên GitHub, đưa toàn bộ thư mục này lên nhánh `main`.
2. Trong **Settings → Secrets and variables → Actions → Secrets**, thêm hai secret:
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API token có quyền **Account / Workers Scripts / Edit**, **Account / D1 / Edit**, **Account / Workers R2 Storage / Edit**.
   - `CLOUDFLARE_ACCOUNT_ID`: Account ID của Cloudflare.
3. Vào **Actions**, chạy workflow **Validate and deploy SKY FIRST NETWORK**. Workflow kiểm tra cấu trúc trước, chạy migration D1 rồi mới deploy Worker.
4. Trong Cloudflare Workers, gắn custom domain `skyfirst.io.vn` vào Worker `sky-first-network` và thêm DNS theo hướng dẫn Cloudflare.
5. Lần đầu mở `https://skyfirst.io.vn/admin`, tạo quản trị viên đầu tiên bằng mật khẩu tối thiểu 14 ký tự. Không chia sẻ màn quản trị hoặc issuer key.

## D1 và R2

`wrangler.jsonc` đã trỏ đúng D1 `wed` và R2 bucket `wed`. Workflow không chứa token. Khi migration đã áp dụng lên D1 production, không sửa lại file migration cũ; hãy tạo migration tăng dần mới.

## QR tài trợ

Vào `/admin`, tab **Nhận diện & liên hệ**, điền đầy đủ `donation_bank_name`, `donation_account_number`, `donation_account_name` và `donation_transfer_note` sau khi xác minh. Website chỉ hiển thị thông tin chính thức khi đã được người quản trị xác nhận và cập nhật.
