# Rà soát Cài đặt & Đồng bộ Website — Sky First Network 2026

Bản này tiếp tục rà soát từ gói `SKY-FIRST-NETWORK-RA-SOAT-TOAN-DIEN-KHONG-GOC-KHUAT-2026.zip`, tập trung vào câu hỏi quan trọng: chỉnh trong Admin có thực sự lưu và lên website công khai hay không.

## Các lỗi đã phát hiện và sửa

1. **Thông báo “đã lưu thành công” trước đây không kiểm tra kết quả Firestore.**
   - `updateSiteConfig()` nay trả về kết quả ghi Firestore.
   - Các nút lưu quan trọng tại Cài đặt, Quản lý Trang chủ và Nội dung toàn cục chỉ báo “đã đồng bộ” khi Firestore thực sự ghi thành công.
   - Nếu Firestore từ chối quyền hoặc mất kết nối, Admin báo rõ dữ liệu có thể chỉ mới cập nhật tại trình duyệt.

2. **Cấu hình website được cập nhật theo một nguồn trạng thái thống nhất.**
   - Thêm `siteConfigRef` để tránh trường hợp nhiều lần cập nhật liên tiếp ghi đè bằng state cũ.
   - Website công khai đang dùng cùng `siteConfig` và listener Firestore nên thay đổi đã lưu được phản ánh trên giao diện.

3. **Logo trong Navbar trước đây bị viết cứng.**
   - Navbar giờ đọc `siteConfig.logoUrl`.
   - Nếu không có logo, chỉ hiển thị tên website, không tự dựng biểu tượng chữ S giả.

4. **Tên và mô tả website trước đây chưa áp dụng đầy đủ.**
   - Tên website nay tác động đến tiêu đề trình duyệt.
   - Mô tả website/tagline nay cập nhật thẻ meta description.
   - Nội dung hướng dẫn trong Admin đã sửa để không hứa sai vị trí hiển thị.

5. **05 trụ cột hoạt động trước đây chỉ lưu localStorage.**
   - Đây là lỗi đồng bộ thật: sửa trong Admin có thể chỉ đổi trên máy đang dùng.
   - Nay 05 trụ cột được lưu tại Firestore `cms_modules/core_pillars`.
   - Có tải lại, khởi tạo và listener realtime để các thiết bị/public website dùng cùng dữ liệu.

6. **Tài khoản quản trị có logic cũ ép một email lập trình viên cụ thể.**
   - Đã xóa hoàn toàn logic `uni.mtanloi@gmail.com` và danh sách tài khoản Gmail cũ.
   - Hệ thống không còn tự reset danh sách quản trị dựa trên email cứng.

7. **Cài đặt vẫn còn hướng dẫn Gmail-only dù đăng nhập đã chuyển sang Email/Password.**
   - Đã bỏ yêu cầu `@gmail.com`.
   - Placeholder đổi thành email tổng quát.

8. **Upload logo trực tiếp có nguy cơ vượt giới hạn Firestore.**
   - Giảm giới hạn file trực tiếp xuống 500 KB và khuyến nghị dùng URL cho ảnh lớn.

9. **Một số câu chữ cũ/không phù hợp còn sót trong Admin.**
   - Loại các nhãn Blogger/Google Blogger còn hiển thị.
   - `Ban điều phối` được đổi sang `Ban Chấp hành` theo cơ cấu đã chốt.
   - Loại cách gọi “Sky First Certificate Authority”.
   - “Lưu Trữ Vĩnh Viễn” đổi thành “Lưu Trữ Trong Hệ Thống”.
   - Các nhãn “trụ sở” không có căn cứ được chuyển thành “địa chỉ liên hệ công khai (nếu có)”.

## Cơ chế hiện tại sau khi sửa

- **Cài đặt website / Nội dung toàn cục / Quản lý Trang chủ:** cập nhật state hiện tại và ghi Firestore.
- **Public website:** đọc cùng DataContext và nhận cập nhật realtime từ Firestore.
- **Nếu Firebase ghi thành công:** thay đổi có thể xuất hiện ngay trên website đang mở và được giữ khi tải lại/đổi thiết bị.
- **Nếu Firebase ghi thất bại:** Admin không còn báo thành công giả; sẽ cảnh báo kiểm tra quyền hoặc kết nối.
- **05 trụ cột:** đã được đưa vào Firestore thay vì chỉ localStorage.

## Kiểm tra kỹ thuật

- Đã chạy kiểm tra transpile cú pháp cho toàn bộ `.ts/.tsx` trong `src/`: **OK**.
- `npm run build` chưa chạy được do thư mục hiện tại không có `node_modules`/Vite (`vite: not found`). Đây không phải lỗi cú pháp source; Cloudflare hoặc môi trường đã cài dependency vẫn cần chạy build cuối cùng.

## Lưu ý quyền Firestore

Theo `firestore.rules` hiện tại, sửa `site_config` chỉ được phép cho vai trò `developer` hoặc `admin`. Vai trò `editor` không được phép ghi `site_config`. Đây là chủ đích phân quyền hiện tại; nếu muốn Biên tập viên được sửa cấu hình toàn cục thì phải thay rules và UI phân quyền cùng lúc.
