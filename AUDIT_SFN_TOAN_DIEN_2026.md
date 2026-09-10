# Rà soát toàn diện Sky First Network 2026

Bản này tiếp tục từ bản `RA-SOAT-SAU-DON-SACH` và tập trung loại bỏ các vùng nội dung công khai còn hard-code hoặc module quản trị không tác động tới website thật.

## Đã chỉnh
- Menu điều hướng chuyển từ cấu hình cứng trong `Navbar.tsx` sang `siteConfig.navigationGroups`.
- Chân trang chuyển từ mảng cứng trong `Footer.tsx` sang dữ liệu có thể chỉnh: liên kết nhanh, liên hệ, các cổng Sky First, liên kết pháp lý và bản quyền.
- Thêm mục Admin `Nội dung toàn cục` để chỉnh menu, 05 trụ cột, 06 giá trị cốt lõi và toàn bộ chân trang.
- 05 trụ cột Trang chủ tiếp tục lấy từ `corePillars`; Admin có thể chỉnh từng tiêu đề và mô tả.
- 06 giá trị cốt lõi Trang chủ chuyển sang `siteConfig.coreValues` và có thể chỉnh từ Admin.
- Số/nhãn `05 Trụ cột hoạt động` và `06 Giá trị cốt lõi` của khối Định hướng chuyển thành dữ liệu cấu hình và có thể chỉnh trong Quản lý Trang chủ.
- Trang Chương trình, Tin tức, Đơn vị trực thuộc sử dụng tiêu đề/mô tả từ cấu hình thay vì khóa cứng phần mở đầu.
- Trang Tham gia, Liên hệ, Hợp tác & Đồng hành được nối lại với dữ liệu `customPages` / cấu hình toàn cục; nội dung chính không còn là các khối mô tả cố định không sửa được.
- Thông tin liên hệ trên Trang Liên hệ đọc trực tiếp từ cấu hình chân trang, tránh một nơi sửa một kiểu.
- Xóa các chuỗi viết tắt/di sản còn sót như SFN, TNV, GCN, BCH, BĐH, SFYC, SFIR, SFMC, SFCA khỏi source hiển thị; đổi các tên `Ban Điều phối/Ban Điều hành` còn sót về `Ban Chấp hành` khi đúng ngữ cảnh.
- Mã phát sinh ở form chương trình đổi tiền tố từ `SFN-` sang `SKYFIRST-` để không đưa viết tắt nội bộ ra giao diện.
- Email quản trị trong type không còn chú thích là Gmail.

## Nguyên tắc sau sửa
- Nội dung tổ chức/biên tập: phải có nơi chỉnh trong Admin hoặc lấy từ dữ liệu quản lý tương ứng.
- Không seed thành tích, số liệu, đối tác, giấy chứng nhận hay chương trình giả làm dữ liệu thật.
- Không đưa viết tắt nội bộ lên giao diện công khai.
- Logo dùng asset chính thức, không vẽ lại.
- Menu/chân trang không còn là mã cứng phải sửa source khi đổi nội dung.

## Kiểm tra kỹ thuật
- Đã quét source cho các cụm di sản: không còn kết quả với SFN/TNV/GCN/BCH/BĐH/SFYC/SFIR/SFMC/SFCA, Ban Điều hành/Ban Điều phối, Hà Nội, LinkedIn, YouTube, slogan cũ, 100.000, 500 giờ, "hàng đầu".
- Môi trường hiện tại không hoàn tất `npm install` trong giới hạn thời gian, nên bước compile cuối vẫn cần được xác nhận bằng Cloudflare/Vite build khi triển khai.
