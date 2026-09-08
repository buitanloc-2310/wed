# Sky First Network — Bản chính trước khi gắn tên miền

Bản này được chuẩn bị để đưa lên Cloudflare Pages preview (`*.pages.dev`) trước khi gắn `skyfirst.io.vn`.

## Đã xử lý
- Thiết kế trang chủ mới, không dùng lại bố cục trang cũ.
- Header dùng đúng logo gốc Sky First Network.
- Menu lớn có dropdown menu con; mobile dùng accordion.
- Giữ các trang/chức năng hiện có: Giới thiệu, Chương trình, Đơn vị trực thuộc, Tin tức, Tra cứu Giấy chứng nhận, Tham gia, Liên hệ, Admin.
- Logo Câu lạc bộ Tiếng Anh The Sky First và Nhà Hán Ngữ dùng từ bộ file gốc trong `/public/brand`.
- Firebase Web Config có fallback theo project `skyfirstnetwork`; không còn phụ thuộc hoàn toàn vào `.env` để nhận diện cấu hình Firebase Authentication.
- Footer có dòng bản quyền thuộc Mạng lưới Giáo dục & Phát triển Cộng đồng Sky First.
- Không đưa module tài trợ/đối tác chưa xác nhận vào menu công khai mặc định.

## Firebase Authentication
Source đã có Web Firebase Config. Để đăng nhập thật, Firebase Console của project `skyfirstnetwork` phải bật provider Google và/hoặc Email/Password. Đây là thiết lập phía Firebase Console, không thể thay bằng mã frontend.

## Cloudflare Pages
Build command: `npm run build`
Build output: `dist`
Root directory: để trống

## Kiểm thử
Môi trường hiện tại không tải xong node_modules nên không thể hoàn tất build/lint tại đây. Hãy dùng lần build của Cloudflare Pages để xác nhận production build trước khi gắn tên miền.
