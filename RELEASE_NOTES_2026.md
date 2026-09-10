# Sky First Network — Hoàn thiện website chính 2026

## Tra cứu GCN
- Giữ nguồn GCN nội bộ của website chính.
- Nếu không tìm thấy nội bộ, tự động tra cứu Nhà Hán Ngữ qua API công khai.
- Hỗ trợ cả `payload.item` và `payload.certificate`.
- Hiển thị nguồn dữ liệu, loại giấy, đơn vị cấp và trạng thái thu hồi.
- Không cache kết quả NHN (`cache: no-store`).
- Không sao chép dữ liệu NHN vào Firestore website chính.

## Hệ sinh thái
Footer được bổ sung các cổng: website chính, Member, TNV, CTT, SFEC, Nhà Hán Ngữ và Academic.

## Giao diện / ổn định
- Bổ sung quy tắc typography tiếng Việt, giảm lỗi giãn/tách chữ.
- Bổ sung favicon và theme color.
- Không có migration xóa dữ liệu; không reset tài khoản hoặc Firestore.

## Biến môi trường tùy chọn
`VITE_NHN_CERTIFICATE_LOOKUP_URL=https://ctt.nhahanngu.io.vn/api/lookup/certificate`
