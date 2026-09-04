# GitHub release — Sky First Network

Đây là mã nguồn production cho `skyfirst.io.vn`, website trung tâm của toàn hệ thống Sky First.

## Điểm triển khai

- Không có bộ website HTML tách rời trong gói phát hành. Worker render toàn bộ route công khai từ CMS/D1.
- Các route chính gồm `/home`, `/gioi-thieu`, `/linh-vuc`, `/don-vi`, `/tham-gia`, `/tin-tuc`, `/tra-cuu`, `/tai-tro-dong-hanh` và `/lien-he`.
- `https://skyfirst.io.vn/tra-cuu` là điểm tra cứu tập trung cho GCN và thành tích do toàn bộ website, cổng và ứng dụng Sky First phát hành.
- Website/cổng/app muốn phát hành phải dùng issuer key riêng từ Admin; nguồn phát hành trong kết quả được gắn theo issuer key.
- Nội dung, menu, logo, màu, favicon, tài trợ/QR và dữ liệu GCN được quản lý qua `/admin`.

## Cách đưa lên Cloudflare

```bash
npm install
npm run check
npm run deploy
```

Sau lần triển khai đầu tiên, truy cập `/admin` để tạo tài khoản SUPER ADMIN.

## GitHub Actions

Workflow `.github/workflows/quality-and-deploy.yml` chạy kiểm tra cho pull request và tự deploy khi push vào `main`. Xem `GITHUB-CONNECTION.md` để thiết lập hai GitHub secrets bắt buộc.
