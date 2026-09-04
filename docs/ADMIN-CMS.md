# ADMIN CMS

`/admin` là hệ thống quản trị riêng và không xuất hiện như liên kết nổi bật ở website public.

Các module: Trang, Bài viết, Chuyên mục, Chương trình/Dự án, Lớp học, Hoạt động, Đơn vị trực thuộc, Nhân sự công khai, Đối tác, Thư viện hình ảnh, Tài liệu, Media, GCN/Tra cứu, Biểu mẫu/Đăng ký, Menu, Hệ thống Sky First, Ngôn ngữ, Chuỗi giao diện đa ngôn ngữ, Footer/Cài đặt & SEO, Khóa cấp GCN, Tài khoản quản trị và Nhật ký/Audit.

Quyền được kiểm tra server-side:
- `SUPER_ADMIN`: toàn quyền, tạo quản trị viên và issuer key.
- `ADMIN`: quản trị nội dung + cấu hình hệ thống, trừ chức năng dành riêng SUPER ADMIN.
- `EDITOR`: đọc/tạo/sửa nội dung được phân loại là biên tập; không tự xuất bản Trang/Bài viết/UI string.
- `REVIEWER`: đọc/rà soát/cập nhật và xuất bản các module nội dung được phép; không tự tạo tài khoản quản trị hoặc sửa cấu hình hệ thống.

Nội dung thường ngày được cập nhật tại đây; không cần sửa source hoặc đóng ZIP mới.
