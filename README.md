# SKY FIRST NETWORK — website chính thức 2026

Đây là codebase mới hoàn toàn cho `skyfirst.io.vn`: website trung tâm của hệ sinh thái Sky First. Worker triển khai có tên `wed` để khớp Worker đang gắn với tên miền.

## Nguyên tắc triển khai

- Public brand: **SKY FIRST NETWORK** và **Sky First**; không hiển thị viết tắt ở giao diện công khai.
- Chỉ có hai ngôn ngữ xuất bản nội bộ: Việt và English. Không gọi API dịch bên ngoài.
- Không có HTML demo trong `public/`. Worker render mọi route công khai từ D1.
- `skyfirst.io.vn/tra-cuu` là điểm xác thực tập trung cho thành tích/GCN từ các website và app Sky First được cấp quyền.
- Nội dung có thay đổi được lưu trong D1 và chỉnh qua `/admin`; R2 chỉ lưu tài sản đã được phép công khai.

## Cấu trúc

| Thư mục | Vai trò |
| --- | --- |
| `src/` | Worker, API, render, bảo mật và CMS |
| `public/` | CSS, JavaScript giao diện và logo đã bàn giao |
| `migrations/` | Schema + dữ liệu nội dung xuất bản |
| `docs/` | đặc tả và checklist phát hành |
| `.github/` | kiểm tra/deploy từ GitHub |

## Chạy

```bash
npm install
npm run db:local
npm run dev
```

Không chạy `db:remote` cho đến khi đã kiểm tra cẩn thận D1 production.
