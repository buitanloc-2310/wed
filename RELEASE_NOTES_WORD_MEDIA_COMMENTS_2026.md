# Sky First Network Website — Hoàn thiện nội dung & hệ thống 2026

Ngày rà soát: 11/09/2026

## Phạm vi bản cập nhật

- Đồng bộ nội dung nền từ tài liệu `SFN_33_CAU_HOI_NOI_DUNG_WEBSITE_KEM_QUY_CHUAN_LOGO_2026` vào CMS dưới dạng các trang nội dung chính thức.
- Giữ dữ liệu CMS do quản trị viên tạo; chỉ các slug thuộc nguồn nội dung chính thức mới được làm mới theo phiên bản nguồn.
- Không thay đổi luồng tra cứu GCN đang sử dụng; giữ các adapter CTT/SFEC/TNV/NHN hiện có.
- Chuẩn hóa logo được bàn giao và tạo bản web chỉ cắt vùng trống thừa, không vẽ lại/đổi màu/kéo giãn.
- Public bài viết không hiển thị tác giả; giữ ngày đăng và bổ sung bình luận có kiểm duyệt.
- Bổ sung R2 Media Library và upload ảnh trực tiếp trong Admin/ô URL ảnh.
- Bổ sung lưu thật biểu mẫu Liên hệ và Đăng ký chương trình vào Cloudflare D1.
- Bổ sung Admin quản lý bình luận, liên hệ, đăng ký và media trên máy chủ.
- Không hiển thị bản nháp chương trình/bài viết/trang nội dung ở public.
- Lọc nội dung public theo `isPublished` và sửa các đường dẫn/trang bị sai.
- Bổ sung trang Chính sách bảo mật và Điều khoản sử dụng cơ bản.
- Thêm security headers, chống tràn ngang và tối ưu responsive cho ảnh/logo/nội dung dài.

## Thiết lập bắt buộc sau khi deploy

### 1. Chạy migration D1 (an toàn, additive)

```bash
npx wrangler d1 migrations apply wed --remote
```

Migration mới: `migrations/0010_website_media_comments_contacts.sql`.
Migration chỉ tạo bảng/index mới; không có `DROP TABLE`, không reset dữ liệu hiện có.

### 2. Thêm secret quản trị API

Trên Cloudflare project `wed`, thêm biến bí mật:

`ADMIN_API_TOKEN=<chuỗi bí mật dài, ngẫu nhiên>`

Có thể đặt bằng dashboard Cloudflare hoặc CLI phù hợp với Pages project. Không đưa token vào source GitHub hoặc biến `VITE_*`.

Token này được dùng cho các thao tác Admin với Media, Bình luận, Liên hệ và Đăng ký. Trình duyệt chỉ giữ token trong `sessionStorage` của phiên quản trị hiện tại.

## R2

Binding đã dùng: `MEDIA`, bucket: `wed`.
Ảnh upload được lưu dưới prefix `website/YYYY/MM/...` và truy cập qua `/media/...`.

## Ghi chú kiểm tra

- Các file TypeScript/TSX đã được parse bằng TypeScript compiler API để bắt lỗi cú pháp.
- Các Cloudflare Function JavaScript đã chạy `node --check`.
- `package.json` và `wrangler.jsonc` đã parse hợp lệ.
- Môi trường đóng gói không cài xong toàn bộ `node_modules` trong thời gian cho phép, nên chưa xác nhận bằng một lượt `vite build` production đầy đủ. Nên để Cloudflare/GitHub build chạy một lượt sau khi push.
