# TRA CỨU TOÀN HỆ THỐNG SKY FIRST

`https://skyfirst.io.vn/tra-cuu` là cổng xác thực trung tâm của toàn hệ thống Sky First. Một GCN hoặc thành tích được cấp từ website, cổng hoặc ứng dụng trực thuộc chỉ cần gọi API trung tâm bằng khóa cấp riêng; người nhận luôn tra cứu tại một địa chỉ duy nhất trên website chính.

- Issuer API key được tạo từ Admin, raw key chỉ trả một lần; D1 chỉ lưu SHA-256 hash.
- `POST /api/certificates/issue` tạo GCN/thành tích ở trạng thái `pending_qr` với mã và verification token ngẫu nhiên, unique ở D1 trung tâm.
- `issuing_system` được lấy bắt buộc từ issuer key đã cấp, không nhận tên hệ thống từ dữ liệu gửi lên. Vì vậy một cổng không thể mạo nhận cổng khác.
- `POST /api/certificates/:code/finalize` bắt buộc có `qr_url` và issuer phải đúng issuer đã phát hành GCN đó.
- `valid_until` quá hạn được trả công khai với effective status `expired`.
- Thu hồi chuyển trạng thái `revoked`; bản ghi không bị xóa.
- Public lookup chỉ trả các trường phục vụ xác thực; không trả dữ liệu liên hệ hoặc dữ liệu riêng tư.
