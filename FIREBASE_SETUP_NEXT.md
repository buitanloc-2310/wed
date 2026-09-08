# Firebase đã được điền vào source

Project ID: skyfirstnetwork
Tài khoản quản trị đầu tiên được khởi tạo trực tiếp tại trang quản trị bằng Email + Mật khẩu.

## Còn phải bật trong Firebase Console trước khi dùng thật

1. Authentication > Sign-in method:
   - Không cần bật Google.
   - Bật Email/Password nếu muốn tạo tài khoản quản trị bằng email + mật khẩu.

2. Firestore Database:
   - Tạo database nếu chưa có.
   - Deploy `firestore.rules` trong source.

3. Hosting:
   - Deploy thư mục `dist` sau khi `npm install` và `npm run build` thành công.

4. Functions / API Giấy chứng nhận:
   - Source đã có thư mục `functions/`.
   - Không đưa secret server vào biến `VITE_*`.

## Kiểm thử build
Môi trường hiện tại chưa tải được dependencies npm trong thời gian cho phép, nên chưa xác nhận production build.
Trên máy có Internet chạy:

npm install
npm run lint
npm run build
