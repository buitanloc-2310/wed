# Sky First Network — Kiểm tra bản cập nhật 1.1.0

Ngày kiểm tra: 05/10/2026. Nguồn: ZIP wed-main(8).zip. Giữ nền tảng website gốc: React/Vite + Cloudflare Pages Functions + D1 + R2 + Firebase Authentication.

## Các thay đổi chính

- Sửa lỗi TypeScript của mô tả menu; tách tải trang quản trị và các trang nội dung theo nhu cầu.
- Thiết kế lại banner trang chủ, nhịp khoảng cách và hệ màu xanh/navy. Tiêu đề, mô tả, hai nút và ảnh banner lấy từ cấu hình đã lưu; ảnh có chế độ phủ khung hoặc giữ toàn bộ.
- Ảnh nhận diện giữ tỷ lệ, có giao diện thay thế khi thiếu ảnh. Không hiển thị nhãn kỹ thuật về kích thước ảnh ở trang công khai.
- Thư viện media tải nhiều tệp, kéo thả, tiến độ và báo lỗi từng tệp; tối đa 50 tệp/lượt, 20 MB/tệp, 3 yêu cầu đồng thời. Phân trang kho R2 theo 100 tệp; chỉnh alt/chú thích, tìm kiếm trong tệp đã tải.
- Các trường ảnh và trình soạn bài có thể tái sử dụng ảnh trong thư viện. Logo cài đặt và QR tài trợ lưu tệp R2 thay vì dữ liệu base64 trong cấu hình.
- Backend xác minh phiên quản trị, kiểm tra chữ ký định dạng tệp, từ chối SVG có nội dung hoạt động và bảo vệ tệp đang được CMS tham chiếu. Đường dẫn ảnh hỗ trợ ETag/304 và HEAD.
- Sửa việc dữ liệu đã xóa xuất hiện lại từ nội dung mặc định. Ghi nhận riêng trang đã xóa/ẩn; sửa một trang vẫn giữ các trang nền khác. Giao dịch lưu CMS dùng batch D1.
- Giữ thay đổi đang soạn khi xuất bản thất bại và báo đúng trạng thái lưu. Không để tác vụ tải lại định kỳ ghi đè trình chỉnh sửa của quản trị viên.
- Kiểm tra sức khỏe lấy kết quả kết nối API thật. Xem trước tablet/mobile dùng viewport riêng. Xử lý lỗi xác minh phiên đăng nhập tránh promise không được xử lý.
- Làm sạch nội dung HTML khi dán/nhập; loại script, iframe, sự kiện và liên kết không hợp lệ trước khi hiển thị.
- Cập nhật tài liệu vận hành/deploy và thêm migration 0013, bộ kiểm tra tích hợp. Build đã được kiểm tra; không kèm dist sinh tự động trong gói 100 tệp.

## Kết quả kiểm tra

- `npm run lint`: PASS.
- `npm test`: PASS, 8 kiểm tra gồm quyền truy cập, bài nháp, xóa/khôi phục, tải/đọc ảnh, metadata, kho 102 tệp và phân trang, liên hệ, duyệt bình luận, đóng đăng ký.
- `python3 scripts/verify_release.py`: PASS; kiểm tra migration cộng thêm và 18 slug cấu hình.
- `npm run build`: PASS; không còn cảnh báo chunk vượt 500 kB. Entry JS khoảng 283 kB; trang quản trị khoảng 488 kB, tải riêng; thư viện chung được tách thành chunk.
- 14 Pages Function files: PASS kiểm tra cú pháp.
- Kiểm tra trình duyệt Chromium trong môi trường D1/R2 cô lập: desktop 1440, tablet 768, mobile 390; banner/nút/ảnh CMS, 9 đường dẫn công khai, đăng nhập, tải nhiều tệp có tệp lỗi, sửa metadata và lưu nội dung trang chủ qua giao diện.

## Phạm vi xác minh

D1 thử nghiệm là SQLite trong bộ nhớ, R2 là kho fixture; luồng Firebase dùng phản hồi giả lập có kiểm soát. Không gửi dữ liệu, email hay thao tác đến hệ thống đang chạy. Các kiểm tra này xác minh tích hợp ứng dụng, không thay thế kiểm tra trên tài khoản Cloudflare/Firebase thật.

Bản này chưa deploy lên tên miền. Chưa kiểm thử trình duyệt Safari/Firefox, gửi email thật hoặc khởi tạo service account thật. Kho ảnh chưa tạo thumbnail/tối ưu định dạng tự động. Nội dung, logo, cấu hình nhận diện và các URL gốc được giữ; dữ liệu QA không nằm trong dữ liệu mặc định hoặc dist.

Xem CLOUDFLARE_DEPLOY.md để cập nhật đúng project wed và README.md để vận hành CMS.

## Gói giới hạn 100 tệp

Đã giải nén bản 170 tệp, loại toàn bộ dist (gồm các chunk build cũ trùng lặp). Loại cấu hình Firestore/AI Studio không được kiến trúc hiện tại sử dụng và ghi chú lịch sử đã thay thế. Loại hai modal chi tiết không thể được mở từ App vì mọi thao tác đã chuyển sang trang chi tiết. Thay các import qua firebaseAuth.ts (chỉ re-export) bằng firebase.ts. Không bỏ trang, API quản trị, migration, ảnh hoặc kiểm thử đang dùng.

Gói cuối có đúng 100 tệp thường, đếm mọi thư mục sau giải nén; thư mục không được tính là tệp. Cloudflare chạy npm run build để tạo dist khi triển khai. Node_modules và các tệp build phát sinh không thuộc gói bàn giao.
