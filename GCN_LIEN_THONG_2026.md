# Tra cứu Giấy chứng nhận liên thông — Sky First Network

- `skyfirst.io.vn/certificate` tra dữ liệu nội bộ trước.
- Nếu không có, hệ thống tiếp tục gọi API công khai Nhà Hán Ngữ: `https://ctt.nhahanngu.io.vn/api/lookup/certificate`.
- API chấp nhận cả dạng phản hồi `payload.item` và `payload.certificate`.
- Trạng thái `revoked` được hiển thị là đã thu hồi, không gắn nhãn hợp lệ.
- Không sao chép dữ liệu NHN vào Firestore của website chính; NHN vẫn là nguồn gốc của bản ghi NHN.
- Có thể cấu hình URL qua `VITE_NHN_CERTIFICATE_LOOKUP_URL`.

Bản này không xóa dữ liệu Firestore/D1 và không chạy migration phá dữ liệu.
