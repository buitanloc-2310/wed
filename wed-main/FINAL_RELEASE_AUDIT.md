# Sky First Network Website — FINAL release audit (28/09/2026)

## Hoàn thiện ở bản FINAL
- Giữ clean routing `/:slug`, tương thích link cũ `/page/:slug` và `/trang/:slug`.
- Header desktop được phân bố theo chiều ngang: logo | menu co giãn/căng đều | tra cứu; dropdown rộng hơn và hỗ trợ mô tả menu con.
- Nội dung public đã loại tên viết tắt `SFN` và dùng `Sky First Network`; email Gmail không xuất hiện ở public UI.
- ROOT OWNER Gmail trong lớp xác thực được giữ nguyên có chủ đích để tránh phá quyền truy cập quản trị.
- Media UI chuyển sang upload-first: không còn ô dán URL ảnh trong các editor đã rà; ảnh đại diện/gallery upload trực tiếp.
- Rich text editor cho chọn và tải nhiều ảnh từ thiết bị tại vị trí đang soạn thay vì prompt URL.
- Bài viết và chương trình hỗ trợ ảnh đại diện + nhiều ảnh gallery; ảnh public không còn nhãn bắt buộc 16:9.
- Media upload hỗ trợ JPG/JPEG, PNG, WebP, GIF, AVIF, SVG; PDF vẫn được hỗ trợ cho kho tài liệu/chứng từ.
- Ảnh chân dung About và logo Settings dùng luồng tải ảnh; QR tài trợ không còn UI dán URL ảnh thủ công.
- Luồng Chương trình -> Hồ sơ -> Tiếp nhận -> Người tham gia và email sự kiện từ Step 5 được giữ nguyên.
- Tài trợ giữ VietQR tự sinh, upload chứng từ và trạng thái đối soát/xác minh.
- Clean source từ Step 1-6 được giữ; không tạo các file copy/version rác.

## Kiểm tra
- `python3 scripts/verify_release.py`: PASS.
- Rà source public: không còn `SFN`, `gmail.com`, hoặc nhãn `16:9` trong `src` public.
- Rà Admin: không còn prompt/ô nhập `URL ảnh`, `URL logo`, `dán URL` cho media editors.
- Tổng số file release: 100 (bao gồm audit này).

## Build
Môi trường làm việc không hoàn tất `npm install` trong giới hạn thời gian nên không tuyên bố local Vite build PASS. Bản Step 6 trước đó đã deploy Cloudflare thành công; FINAL giữ nguyên package/deploy foundation đó và chỉ thay source/config liên quan.
