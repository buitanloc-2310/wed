# Báo cáo kiểm tra và tinh gọn build — Sky First Network

## Kết quả xử lý mã nguồn

- Chọn `wed-main/` ở cấp dự án làm bản nguồn chính; loại bỏ bản dự án cũ lồng bên trong `wed-main/`, tránh đóng gói trùng toàn bộ source và API.
- Loại 33 tệp TS/TSX không có import tĩnh/dynamic literal nào trỏ tới từ source graph đang chạy. Không xóa các route Cloudflare, migrations D1, dữ liệu baseline, logo/ảnh thương hiệu hay cấu hình triển khai.
- Còn 40 tệp trong `src/` và 94 tệp trong gói nguồn sau khi thêm báo cáo. **Chưa đạt mục tiêu tổng 45–50 tệp**: phần lớn tệp còn lại là Cloudflare Functions, migrations, tài sản tĩnh và cấu hình bắt buộc; gộp/xóa chúng để ép số lượng sẽ có nguy cơ làm hỏng route hoặc lịch sử nâng cấp D1.
- Ghim trực tiếp `esbuild@0.25.12` vào devDependencies, khớp entry đã có trong lockfile.
- Chuyển `vite.config.ts` sang lấy thư mục dự án từ `import.meta.url`, không phụ thuộc `__dirname`.
- Sửa `scripts/verify_release.py` dùng TypeScript compiler API (đã là dependency của dự án), không còn phụ thuộc ngầm vào `@babel/core`.

## Kết quả kiểm tra thực tế

| Hạng mục | Kết quả |
|---|---|
| `node --test tests/backend.test.mjs` | PASS — 17 tests, 0 failures sau khi tinh gọn |
| Cú pháp Cloudflare Functions (`node --check`) | PASS — 18/18 |
| Import path và named export | PASS — 175 import/named-export, 0 liên kết gãy sau khi tinh gọn |
| Parse/transpile TS/TSX bằng TypeScript API | PASS — 0 lỗi cú pháp trên 38 tệp TS/TSX được biên dịch (không tính file khai báo `.d.ts`) |
| `npm ci` | BLOCKED — registry npm không phản hồi trong môi trường kiểm tra |
| `npm run lint` | NOT VERIFIED — thiếu dependency/type definitions (`@types/react`, `@types/node` và các gói liên quan) |
| `npm run build` | NOT VERIFIED — `vite: not found` vì chưa cài được dependency |

## Giới hạn và khuyến nghị

Không thể tuyên bố Vite production build đã PASS khi chưa cài được dependency. Lỗi `vite: not found` là do môi trường không có `node_modules`, không phải bằng chứng cho thấy mã nguồn Vite bị lỗi. Trước khi deploy, chạy `npm ci`, `npm run lint`, `npm run build` trong môi trường có truy cập npm registry. Chưa triển khai production và không chạy migration lên D1 remote.

Để ép tổng project xuống 45–50 tệp mà không mất tính năng, cần thực hiện bundling frontend và Cloudflare Functions thành artifact triển khai thực sự; đây không thể được xác nhận trong phiên này khi Vite/Wrangler và dependency chưa cài được.
