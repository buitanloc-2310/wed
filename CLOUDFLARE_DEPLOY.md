# Deploy Sky First Network bằng GitHub + Cloudflare Pages

Project Cloudflare: `wed`

## Bindings chuẩn
- D1: `DB` -> database `wed`
- R2: `MEDIA` -> bucket `wed`

## Cloudflare Pages build settings
- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: để trống

## Biến môi trường cần thêm trong Cloudflare Pages
Thêm các biến Vite từ `.env.example` vào Settings > Variables and Secrets của project Pages.
Không đưa secret server vào biến bắt đầu bằng `VITE_`.

## Firebase
Firebase vẫn được dùng cho Authentication / Firestore theo source hiện tại.
Tài khoản quản trị đầu tiên được khởi tạo trực tiếp tại trang quản trị bằng Email + Mật khẩu.

## Lưu ý về D1/R2
`wrangler.jsonc` đã khai báo D1 và R2 binding để dùng cho Cloudflare Functions/Workers sau này.
Frontend React trong `src/` không thể truy cập trực tiếp binding D1/R2; phải đi qua Cloudflare Pages Functions/Worker.
Source hiện tại chưa chuyển dữ liệu CMS từ Firestore sang D1 và chưa chuyển media sang R2 để tránh phá kiến trúc đang có. D1/R2 đã được cấu hình sẵn làm nền tảng cho bước tích hợp backend tiếp theo.
