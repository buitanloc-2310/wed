# Sky First Network — Website & CMS

Website hiện có được cập nhật trên Cloudflare Pages. Có trang quản trị để sửa trang, đăng tin, quản lý chương trình, menu, bố cục và thư viện ảnh. Nội dung lưu ở D1; ảnh và PDF lưu ở R2; đăng nhập dùng Firebase Authentication.

## Sử dụng

1. Mở `/admin` và đăng nhập bằng tài khoản quản trị đã cấp quyền.
2. **Quản lý Trang chủ**: sửa tiêu đề, nút bấm, banner; ẩn/hiện và di chuyển các khối. Chọn **Giữ toàn bộ** cho logo/poster, **Phủ khung** cho ảnh hoạt động.
3. **Media**: kéo thả hoặc chọn nhiều tệp, tối đa 50 tệp/lượt, 20 MB/tệp. Tìm kiếm theo tên, mô tả hoặc chú thích; dùng **Tải thêm** cho kho lớn. Các trường ảnh có nút chọn từ thư viện.
4. **Trang / Bài đăng / Chương trình**: soạn nội dung, tải ảnh, lưu nháp hoặc xuất bản. Kiểm tra thông báo lưu thành công trước khi đóng.
5. **Chỉnh sửa Website**: chọn khối cần chỉnh và xem bố cục desktop/tablet/mobile.
6. **Tình trạng hệ thống**: kiểm tra kết nối dữ liệu và kho tệp thực tế.

Tệp đang được nội dung đã lưu sử dụng sẽ được giữ lại khi yêu cầu xóa. Tìm kiếm thư viện áp dụng cho các trang tệp đã tải; dùng Tải thêm để mở rộng kết quả.

## Chạy và triển khai

Node.js 24 trở lên. Tại thư mục chứa `package.json`:

```sh
npm ci
npm run check
npm run build
```

`npm run dev` chỉ xem giao diện; API cần môi trường Cloudflare Pages Functions. Bản ZIP có đúng 100 tệp, gồm mã nguồn, ảnh, cấu hình, API và kiểm thử. `dist/` được tạo bởi `npm run build`; không đóng gói bản build sinh tự động để giữ giới hạn tệp. Xem [CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md) để cập nhật project `wed` hiện có. Không upload riêng `dist/` lên hosting tĩnh nếu cần CMS.

Bản bàn giao đã kiểm tra trong môi trường thử nghiệm; chưa được triển khai lên tên miền đang chạy.
