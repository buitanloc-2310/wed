# Sky First Network – triển khai 2026

- Website điện tử, không dùng thuật ngữ “cổng thông tin” làm tên sản phẩm.
- Logo chính: `public/brand/sky-first-network.png`; logo hai đơn vị trực thuộc nằm cùng thư mục; favicon dùng nhận diện Sky First Network trên nền trắng.
- 33 nhóm nội dung được khởi tạo trong CMS và có thể sửa/xóa/ẩn/hiện từ mục Trang.
- Hai đơn vị mặc định: Câu lạc bộ Tiếng Anh The Sky First và Nhà Hán Ngữ.
- 5 trụ cột hoạt động tách biệt với 6 giá trị cốt lõi.
- Khối số liệu và trang tài trợ/đóng góp mặc định không công khai khi chưa có dữ liệu xác nhận.
- Admin có các module bổ sung: Bình luận, Đăng ký, Liên hệ, Giấy chứng nhận, Đối tác & Đồng hành, Tài trợ & Đóng góp, Media, Menu website, Nhật ký.
- Đăng nhập quản trị sử dụng Email + Mật khẩu qua Firebase Authentication. Tài khoản Google khởi tạo đầu tiên phải khớp `VITE_INITIAL_ADMIN_EMAIL`; không có cơ chế “người đầu tiên đăng nhập tự thành quản trị viên”.
- “Quên mật khẩu” hướng người dùng liên hệ `hotro.sfn@gmail.com` / Zalo `0924 910 210`.
- Firestore Rules đã bỏ cửa ghi công khai theo thời gian. Cần tạo `admin_users/{uid}` đúng UID Firebase và role/status trước khi production.
- `functions/certificateApi` là API trung tâm mẫu: GET tra cứu công khai đã lọc dữ liệu; POST yêu cầu secret server-side, chống trùng `code` và chống gửi lặp theo `source + source_id`. Secret phải đặt bằng Firebase Secret Manager, không đặt trong `VITE_*`.
- Mã Sky First Network chuẩn được ghi nhận là dạng `001/GCN-SFN/2026`. Quy tắc mã của Nhà Hán Ngữ, Câu lạc bộ Tiếng Anh The Sky First và đơn vị tương lai chờ file quy chuẩn riêng.
- Trung tâm không trực tiếp cấp Giấy chứng nhận mặc định; dữ liệu đến từ hệ thống cấp. Thu hồi là đổi trạng thái và lưu lịch sử, không xóa bản ghi.
- Các module mới dùng lớp dữ liệu CMS cục bộ hiện có để giao diện hoạt động ngay; khi đưa production nên chuyển các record vận hành (bình luận, đăng ký, liên hệ, đối tác, media, menu, nhật ký) sang collection Firestore tương ứng và rules theo vai trò.
