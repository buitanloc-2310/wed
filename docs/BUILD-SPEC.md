# Đặc tả xây dựng chính thức

## Vai trò

`skyfirst.io.vn` là website công khai trung tâm của Sky First. Các cổng nghiệp vụ được liên kết từ đây nhưng không phải đơn vị trực thuộc.

## Tuyến công khai

`/home`, `/gioi-thieu`, `/hoat-dong`, `/don-vi`, `/tham-gia`, `/hop-tac`, `/tin-tuc`, `/thu-vien`, `/tra-cuu`, `/tai-tro-dong-hanh`, `/lien-he`, `/he-thong`.

Mỗi mục dùng route riêng. Menu con không chồng lên nhau; một menu mở thì các menu khác đóng.

## Dữ liệu được quản trị

Nội dung trang, menu, bản dịch, bài viết, chương trình, lớp học, đợt tuyển, đơn vị, đối tác, thư viện, tài liệu, form, QR/tài trợ, giao diện và các cổng hệ thống đều ở D1. Ảnh/tệp công khai ở R2.

## Bảo mật và công khai

Không đưa secret, token, dữ liệu cá nhân dư thừa, dữ liệu test, tài liệu nội bộ, đối tác/chương trình/chức danh chưa xác nhận lên giao diện. Chỉ nội dung `published` mới công khai.

## Xác thực trung tâm

Mỗi hệ thống phát hành GCN có issuer key riêng. Kết quả tại `/tra-cuu` lấy tên nguồn phát hành từ issuer key, không tin vào dữ liệu do client gửi.

## Nhận diện

Màu: `#159BFF`, `#0648B8`, `#062A67`, `#EAF7FF`, `#FFFFFF`, `#172033`, `#667085`, `#DCE7F2`.

Logo `sky-first-main-logo.png` dùng ở header/footer/favicon; logo chứng nhận chỉ dùng cho ngữ cảnh xác thực. Không dùng ảnh AI/stock để giả hoạt động thật.
