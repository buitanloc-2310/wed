# Sky First Network — Website & CMS

Website hiện có được cập nhật trên Cloudflare Pages. Có trang quản trị để sửa trang, đăng tin, quản lý chương trình, menu, bố cục và thư viện ảnh. Nội dung lưu ở D1; ảnh và PDF lưu ở R2; đăng nhập dùng Firebase Authentication.

## Sử dụng

1. Mở `/admin` và đăng nhập bằng tài khoản quản trị đã cấp quyền.
2. **Quản lý Trang chủ**: sửa tiêu đề, nút bấm, banner; ẩn/hiện và di chuyển các khối. Chọn **Giữ toàn bộ** cho logo/poster, **Phủ khung** cho ảnh hoạt động.
3. **Media**: kéo thả hoặc chọn nhiều tệp, tối đa 50 tệp/lượt, 20 MB/tệp. Tìm kiếm theo tên, mô tả hoặc chú thích; dùng **Tải thêm** cho kho lớn. Các trường ảnh có nút chọn từ thư viện.
4. **Trang / Bài đăng / Chương trình**: soạn nội dung, tải ảnh, lưu nháp hoặc xuất bản. Kiểm tra thông báo lưu thành công trước khi đóng.
5. **Chỉnh sửa Website**: chọn khối cần chỉnh và xem bố cục desktop/tablet/mobile.
6. **Tình trạng hệ thống**: kiểm tra kết nối dữ liệu và kho tệp thực tế.

Tệp đang được nội dung đã lưu sử dụng sẽ được giữ lại khi yêu cầu xóa. Tìm kiếm thư viện áp dụng cho các trang tệp đã tải; dùng Tải thêm để mở rộng kết quả.


## Màu chức danh và nhãn nhận diện

Hệ thống badge dùng `src/components/EntityColorSystem.tsx`. Chức danh, đơn vị, chuyên mục, tag và trạng thái có màu fallback ổn định theo tên; cùng một nhãn không đổi màu sau refresh. Admin có thể chọn màu bất kỳ bằng color picker hoặc chọn preset. Màu tùy chỉnh được lưu ngay cùng document/entity hiện có, không tạo bảng hay truy vấn D1 riêng. Trạng thái nghiệp vụ vẫn dùng semantic status độc lập với role/permission.

## Chạy và triển khai

Node.js 24 trở lên. Tại thư mục chứa `package.json`:

```sh
npm ci
npm run check
npm run build
```

`npm run dev` chỉ xem giao diện; API cần môi trường Cloudflare Pages Functions. Bản ZIP có đúng 100 tệp, gồm mã nguồn, ảnh, cấu hình, API và kiểm thử. `dist/` được tạo bởi `npm run build`; không đóng gói bản build sinh tự động để giữ giới hạn tệp. Khi triển khai project `wed` hiện có, giữ nguyên bindings/secrets đang dùng và chạy migration theo thứ tự trong thư mục `migrations/`. Không upload riêng `dist/` lên hosting tĩnh nếu cần CMS.

Bản bàn giao đã kiểm tra trong môi trường thử nghiệm; chưa được triển khai lên tên miền đang chạy.

## SFN CMS V2 upgrade (2026-10-06)
- Added data-driven Form Builder under Admin > Form Builder.
- Forms support create/edit/duplicate/delete, draft/open/closed state, reorderable fields, required/optional fields and option lists.
- Public Join page now discovers open forms from D1, accepts submissions, issues an SFN application code and provides application lookup without querying when the code is blank.
- Added D1 migration `0014_forms_people_cms.sql` for forms/submissions and the future People source-of-truth table.
- Form deletion explicitly deletes its submissions first; individual submission deletion and status update are available at the API layer.
- Existing certificate center, media library, programs, units, posts, pages, comments, contacts, partners, contributions and audit architecture are retained rather than rebuilt.

### Verification note
`node --test tests/backend.test.mjs` passes 8/8 on this handoff. Full TypeScript/build verification was not claimed because dependency installation did not complete within the execution window; run `npm ci && npm run check && npm run build` in CI before production deployment.
