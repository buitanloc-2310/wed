# Rà soát nâng cao – Tài trợ, Đóng góp & Quyên góp (2026)

## Phạm vi
- Rà lại source từ bản `SKY-FIRST-NETWORK-CAI-DAT-DONG-BO-TOAN-DIEN-2026`.
- Tập trung đặc biệt vào trang `/sponsor`, luồng nhập thông tin ngân hàng, tạo/đính kèm mã QR, số tiền, nội dung chuyển khoản, cảnh báo an toàn và dữ liệu quản trị.
- Đồng thời quét tiếp các placeholder/nội dung cũ không phù hợp còn sót trong source.

## Thay đổi chính
1. Trang tài trợ công khai được viết lại để hiển thị đầy đủ các khối mà Admin đang quản lý: phần đầu trang, nguyên tắc/cam kết, hình thức đồng hành, thông tin chuyển khoản, mã QR, liên hệ, câu hỏi thường gặp và lời kêu gọi hành động.
2. Thêm `sponsorBankId` để nhập mã ngân hàng dùng cho VietQR. Không còn tự đoán ngân hàng từ chuỗi tên ngân hàng, tránh tạo sai mã nhận tiền.
3. Thêm `sponsorDonationNotice` để Admin tự chỉnh cảnh báo an toàn hiển thị công khai.
4. Thêm `sponsorSuggestedAmounts` để Admin cấu hình các mức tiền gợi ý.
5. Trang công khai cho người dùng nhập số tiền mong muốn và nội dung chuyển khoản. Mã QR tự tạo cập nhật theo số tiền/nội dung đó.
6. Không tuyên bố đã nhận tiền sau khi quét QR. Ứng dụng ngân hàng là nơi xác nhận giao dịch cuối cùng.
7. Mã QR chỉ hiện rõ sau khi người dùng xác nhận đã đọc cảnh báo kiểm tra người nhận/ngân hàng/số tài khoản/số tiền/nội dung.
8. Vẫn giữ khả năng tải ảnh QR thủ công trong Admin; nếu có đủ mã ngân hàng + số tài khoản thì mã tự động được ưu tiên trên trang công khai.
9. Số tài khoản có nút sao chép, nhưng không có hành động tự chuyển tiền hay tự động ghi nhận thanh toán giả.
10. Dọn các số điện thoại/email mẫu cũ và nhiều chuỗi cũ không phù hợp.

## Lưu ý pháp lý/vận hành
- Sky First Network hiện không có tư cách pháp lý độc lập; không nên mặc định ghi tên chủ tài khoản là “Sky First Network” nếu tài khoản thực tế đứng tên cá nhân/pháp nhân khác.
- Chỉ công bố số tài khoản, tên người nhận, ngân hàng và mã QR sau khi đã đối chiếu chính xác.
- Không dùng các câu như “100% minh bạch”, “đã kiểm toán”, “bảo đảm hoàn tiền”, “được cấp giấy chứng nhận” nếu không có quy trình/tài liệu thực tế tương ứng.
- QR sinh từ Quick Link giúp điền sẵn thông tin; nó không phải bằng chứng giao dịch thành công và không tự xác nhận tiền đã vào tài khoản.

## Kiểm tra kỹ thuật
- Đã quét các chuỗi legacy trọng yếu trong `src/`.
- Môi trường hiện tại không hoàn tất `npm install` trong thời gian cho phép, nên chưa xác nhận `vite build` hoàn chỉnh tại đây.
