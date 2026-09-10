# Rà soát và chỉnh sửa sâu Sky First Network — 2026

## Phạm vi đã xử lý
- Làm sạch dữ liệu mặc định không có căn cứ: chương trình, tin tức, giấy chứng nhận, nhân sự, timeline và số liệu mẫu.
- Giữ đúng 02 đơn vị trực thuộc mặc định: Câu lạc bộ Tiếng Anh The Sky First và Nhà Hán Ngữ.
- Đồng bộ cơ cấu hiển thị: Ban Chấp hành; Ban Nhân sự; Ban Truyền thông; Ban Đối ngoại & Sự kiện; Văn phòng.
- Loại các tên đơn vị cũ/không còn dùng và các viết tắt hiển thị cũ như SFYC, SFIR, SFMC, SFCA, TNV, GCN.
- Viết lại Trang Đơn vị trực thuộc, Trang Tham gia, Trang Liên hệ và Trang Hợp tác & Đồng hành theo dữ liệu hiện tại, không sử dụng số liệu/quan hệ/địa chỉ không xác nhận.
- Loại thông tin chuyển khoản, tài khoản ngân hàng, VietQR và các cam kết tài chính mặc định khỏi trang Hợp tác & Đồng hành công khai.
- Loại các tuyên bố như “hàng đầu”, “100.000 bạn trẻ”, “toàn quốc”, “kiểm toán”, “dấu đỏ”, giá trị du học/học bổng/CV khỏi dữ liệu công khai mặc định.
- Chuyển dữ liệu tạo mới trong quản trị sang trạng thái bản nháp, không tự xuất bản chương trình hoặc giấy chứng nhận giả định.
- Sửa cách gọi đăng nhập/phân quyền từ “Gmail” thành “tài khoản quản trị/Email”.
- Trang chủ đọc 05 trụ cột từ DataContext và hiển thị đầy đủ mô tả 06 giá trị cốt lõi; khi chưa có chương trình/tin tức thì hiện trạng thái “Chưa có ... được công bố”.
- Bổ sung field Instagram/TikTok đúng tên trong SiteConfig; giữ field cũ chỉ để tương thích dữ liệu đã lưu.

## Nguyên tắc dữ liệu mặc định sau sửa
Dữ liệu mặc định không còn đóng vai trò “demo thành tích”. Nội dung có số liệu, nhân sự, chương trình, giấy chứng nhận hoặc quan hệ hợp tác phải được nhập từ quản trị khi đã có căn cứ.

## Kiểm tra
- Đã quét source để loại các chuỗi legacy chính: SFYC, SFIR, SFMC, SFCA, TNV, GCN, Ban Điều hành, dữ liệu 500 giờ/100.000, địa chỉ Hà Nội & TP.HCM và các cam kết pháp lý/tài chính cũ.
- Đã kiểm tra cân bằng dấu ngoặc trên các file lõi đã chỉnh.
- Chưa xác nhận `npm run build` trong môi trường này vì `npm install` không hoàn thành trong giới hạn thời gian. Cần để Cloudflare/GitHub CI chạy build thực tế sau khi đẩy source.
