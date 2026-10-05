# Cập nhật website gốc trên Cloudflare Pages

## Nền tảng hiện có

Giữ project Pages **wed**, D1 binding **DB** → database **wed**, R2 binding **MEDIA** → bucket **wed** trong `wrangler.jsonc`. Website dùng Firebase Authentication để đăng nhập; CMS lưu D1 và media lưu R2 qua Pages Functions. Đây là CMS của website hiện có, không phải cài đặt WordPress PHP.

## Triển khai qua repository đã liên kết

1. Sao lưu D1 và giữ nguyên bucket R2 trước khi cập nhật.
2. Đưa các tệp trong thư mục chứa `package.json`, `src/`, `functions/`, `migrations/` vào repository hiện có.
3. Cloudflare Pages: framework Vite; build command `npm run build`; output directory `dist`; root directory là thư mục chứa `package.json` trong repository. ZIP chứa một thư mục `wed-main/`; đưa nội dung thư mục này vào gốc repository hoặc đặt đúng Root directory.
4. Áp dụng các migration chưa chạy theo thứ tự 0010 → 0013. Có thể dùng `npx wrangler d1 migrations apply wed --remote` từ thư mục project với tài khoản Cloudflare có quyền. Các migration thêm bảng/chỉ mục, không xóa dữ liệu.
5. Kiểm tra các binding trong Production và Preview, sau đó triển khai cả giao diện và Pages Functions.
6. Mở `/api/cms?collection=site_config&id=current`: phải trả JSON `{ok:true,...}`; kiểm tra `/admin`, tải ảnh và lưu một thay đổi thử. Mở lại trang bằng trình duyệt khác để kiểm tra nội dung lưu trên máy chủ.

## Firebase và tài khoản quản trị

Cấu hình công khai Firebase đã có giá trị mặc định của project hiện tại. Chỉ đặt các biến `VITE_FIREBASE_*` trong `.env.example` nếu cần thay cấu hình; build lại sau khi đổi. Bật Email/Password trong Firebase Authentication và thêm tên miền Pages/tên miền riêng vào Authorized domains.

Chủ sở hữu hiện được xác định phía máy chủ bằng `skyfirst.ec@gmail.com`. Nếu tài khoản Firebase này đã tồn tại, đăng nhập bằng mật khẩu hiện tại; không tạo lại. Backend có thể khôi phục hồ sơ D1 cho chủ sở hữu đã xác thực. Không có mật khẩu mặc định trong bản bàn giao.

Secret **FIREBASE_SERVICE_ACCOUNT_JSON** ở Pages dùng cho khởi tạo chủ sở hữu và thao tác quản trị tài khoản đặc quyền. Giá trị là JSON service account của project `skyfirstnetwork` có quyền quản lý Firebase Authentication. Chỉ đặt ở Variables and Secrets phía máy chủ, tuyệt đối không đặt vào `VITE_` hoặc repository. Có thể đặt **FIREBASE_API_KEY** phía máy chủ nếu thay Firebase project.

Nếu đăng nhập báo Email/mật khẩu sai, xác minh tài khoản ở Firebase. Nếu báo cơ sở dữ liệu/kho tệp chưa sẵn sàng, kiểm tra migration, DB/MEDIA và việc deploy Functions. `npm run dev` hoặc hosting chỉ phục vụ tệp tĩnh không cung cấp những API này.

## Khả năng và giới hạn

Ảnh/PDF lưu bản gốc ở R2, tối đa 20 MB/tệp và 50 tệp/lượt phía giao diện. Tải đồng thời 3 tệp; kho thư viện phân trang 100 tệp. Chưa tạo thumbnail riêng hay chuyển đổi định dạng ảnh tự động. Tối ưu ảnh hoạt động trước khi tải để trang nhẹ hơn. Mô tả thư viện dùng để tìm kiếm; alt hiển thị của từng ảnh phụ thuộc trường nội dung của trang.

Bản cập nhật giữ nội dung gốc và các URL; không chứa ảnh hoạt động, số liệu hay tài khoản thử nghiệm. Chưa kiểm tra với tài khoản Cloudflare/Firebase thật và chưa triển khai lên tên miền trực tiếp.
