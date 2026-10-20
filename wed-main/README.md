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

---

# Appendix: Cloudflare Deployment Guide

<!-- Preserved from CLOUDFLARE_DEPLOY.md; consolidated to keep release file count within the requested limit. -->

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


---

# Appendix: Final Release Audit

<!-- Preserved from FINAL_RELEASE_AUDIT.md; consolidated to keep release file count within the requested limit. -->

# Sky First Network — Kiểm tra bản cập nhật 1.1.0

Ngày kiểm tra: 05/10/2026. Nguồn: ZIP wed-main(8).zip. Giữ nền tảng website gốc: React/Vite + Cloudflare Pages Functions + D1 + R2 + Firebase Authentication.

## Các thay đổi chính

- Sửa lỗi TypeScript của mô tả menu; tách tải trang quản trị và các trang nội dung theo nhu cầu.
- Thiết kế lại banner trang chủ, nhịp khoảng cách và hệ màu xanh/navy. Tiêu đề, mô tả, hai nút và ảnh banner lấy từ cấu hình đã lưu; ảnh có chế độ phủ khung hoặc giữ toàn bộ.
- Ảnh nhận diện giữ tỷ lệ, có giao diện thay thế khi thiếu ảnh. Không hiển thị nhãn kỹ thuật về kích thước ảnh ở trang công khai.
- Thư viện media tải nhiều tệp, kéo thả, tiến độ và báo lỗi từng tệp; tối đa 50 tệp/lượt, 20 MB/tệp, 3 yêu cầu đồng thời. Phân trang kho R2 theo 100 tệp; chỉnh alt/chú thích, tìm kiếm trong tệp đã tải.
- Các trường ảnh và trình soạn bài có thể tái sử dụng ảnh trong thư viện. Logo cài đặt và QR tài trợ lưu tệp R2 thay vì dữ liệu base64 trong cấu hình.
- Backend xác minh phiên quản trị, kiểm tra chữ ký định dạng tệp, từ chối SVG có nội dung hoạt động và bảo vệ tệp đang được CMS tham chiếu. Đường dẫn ảnh hỗ trợ ETag/304 và HEAD.
- Sửa việc dữ liệu đã xóa xuất hiện lại từ nội dung mặc định. Ghi nhận riêng trang đã xóa/ẩn; sửa một trang vẫn giữ các trang nền khác. Giao dịch lưu CMS dùng batch D1.
- Giữ thay đổi đang soạn khi xuất bản thất bại và báo đúng trạng thái lưu. Không để tác vụ tải lại định kỳ ghi đè trình chỉnh sửa của quản trị viên.
- Kiểm tra sức khỏe lấy kết quả kết nối API thật. Xem trước tablet/mobile dùng viewport riêng. Xử lý lỗi xác minh phiên đăng nhập tránh promise không được xử lý.
- Làm sạch nội dung HTML khi dán/nhập; loại script, iframe, sự kiện và liên kết không hợp lệ trước khi hiển thị.
- Cập nhật tài liệu vận hành/deploy và thêm migration 0013, bộ kiểm tra tích hợp. Build đã được kiểm tra; không kèm dist sinh tự động trong gói 100 tệp.

## Kết quả kiểm tra

- `npm run lint`: PASS.
- `npm test`: PASS, 8 kiểm tra gồm quyền truy cập, bài nháp, xóa/khôi phục, tải/đọc ảnh, metadata, kho 102 tệp và phân trang, liên hệ, duyệt bình luận, đóng đăng ký.
- `python3 scripts/verify_release.py`: PASS; kiểm tra migration cộng thêm và 18 slug cấu hình.
- `npm run build`: PASS; không còn cảnh báo chunk vượt 500 kB. Entry JS khoảng 283 kB; trang quản trị khoảng 488 kB, tải riêng; thư viện chung được tách thành chunk.
- 14 Pages Function files: PASS kiểm tra cú pháp.
- Kiểm tra trình duyệt Chromium trong môi trường D1/R2 cô lập: desktop 1440, tablet 768, mobile 390; banner/nút/ảnh CMS, 9 đường dẫn công khai, đăng nhập, tải nhiều tệp có tệp lỗi, sửa metadata và lưu nội dung trang chủ qua giao diện.

## Phạm vi xác minh

D1 thử nghiệm là SQLite trong bộ nhớ, R2 là kho fixture; luồng Firebase dùng phản hồi giả lập có kiểm soát. Không gửi dữ liệu, email hay thao tác đến hệ thống đang chạy. Các kiểm tra này xác minh tích hợp ứng dụng, không thay thế kiểm tra trên tài khoản Cloudflare/Firebase thật.

Bản này chưa deploy lên tên miền. Chưa kiểm thử trình duyệt Safari/Firefox, gửi email thật hoặc khởi tạo service account thật. Kho ảnh chưa tạo thumbnail/tối ưu định dạng tự động. Nội dung, logo, cấu hình nhận diện và các URL gốc được giữ; dữ liệu QA không nằm trong dữ liệu mặc định hoặc dist.

Xem phụ lục “Cloudflare Deployment Guide” trong README.md để cập nhật đúng project web và vận hành CMS.

## Gói giới hạn 100 tệp

Đã giải nén bản 170 tệp, loại toàn bộ dist (gồm các chunk build cũ trùng lặp). Loại cấu hình Firestore/AI Studio không được kiến trúc hiện tại sử dụng và ghi chú lịch sử đã thay thế. Loại hai modal chi tiết không thể được mở từ App vì mọi thao tác đã chuyển sang trang chi tiết. Thay các import qua firebaseAuth.ts (chỉ re-export) bằng firebase.ts. Không bỏ trang, API quản trị, migration, ảnh hoặc kiểm thử đang dùng.

Gói cuối có đúng 100 tệp thường, đếm mọi thư mục sau giải nén; thư mục không được tính là tệp. Cloudflare chạy npm run build để tạo dist khi triển khai. Node_modules và các tệp build phát sinh không thuộc gói bàn giao.


---

# Appendix: Release Notes

<!-- Preserved from RELEASE_NOTES.md; consolidated to keep release file count within the requested limit. -->

# Sky First Web Platform 2026 – Final Upgrade

## Release scope
- Header/CMS navigation expanded to 6 main areas with rich submenus.
- Homepage: one-shot impact counters, horizontal activity newsroom, compact professional ecosystem.
- Seeded substantive landing content for major activity/join pages.
- Prebuilt D1 forms for Members, Core Team, Volunteers, Teaching Volunteers, Partnership and Initiative proposals.
- Landing pages can surface their corresponding open D1 form.
- Footer and editable Organization Information block redesigned for compact public display.
- Certificate lookup redesigned with aggregate statistics and mobile QR camera scan when supported.
- Public Document Center with search/type/year filters.
- Page Builder image blocks support upload/Media Library/URL plus alt, caption, credit and source.
- News taxonomy expanded and custom category supported.
- Draft slugs follow title; published slugs remain stable unless manually changed.
- R2 remains the file/media store; D1 remains for structured data.

## Validation performed
- All Cloudflare Functions JavaScript files pass `node --check`.
- Release contains 100 files and excludes node_modules, .git, dist, .wrangler and environment secret files.
- A complete Vite/TypeScript build could not be re-run in the packaging environment because dependency installation timed out; deploy/build should run `npm ci && npm run check && npm run build` in CI before production promotion.

## Production final 2026-10-07
- Applied global CMS/public synchronization hardening, configurable homepage counters, stable mega menu, featured-news sidebar, compact footer/ecosystem, updated contact channels, Sky First verification naming, global taxonomy, natural-ratio media rules, partnership form, and certificate stats timestamp fix.
- Final source remains exactly 100 files; no node_modules/build/cache/secrets included.


---

# Appendix: Step 5 System Redesign Audit

<!-- Preserved from STEP5_SYSTEM_REDESIGN_AUDIT.md; consolidated to keep release file count within the requested limit. -->

# Step 5 — System redesign

- Kept the cleaned single source tree (`src`, `functions`, `public`, `scripts`); no duplicate backup trees were added.
- Program registration is now configured per program: enabled/open-close window/auto-accept/receipt email/accepted email.
- Accepting a registration creates a participant record. Auto-accept does the same immediately.
- Email events are persisted in an outbox. If `RESEND_API_KEY` exists, the Worker sends immediately using `MAIL_FROM` (default support@skyfirst.io.vn); otherwise the event remains queued rather than being lost.
- Added a read-only Participants area in Admin as the destination of accepted registrations.
- Program and news content support galleries in addition to a featured image. Admin copy no longer treats 16:9 as a universal upload requirement.
- Home news prioritizes content marked Featured and shows up to six items.
- Replaced public/default legacy Gmail contacts with role-based `@skyfirst.io.vn` contacts. The protected bootstrap owner login remains unchanged because it is authentication infrastructure, not a public contact address.
- Fixed the support mailto typo (`suopport` -> `support`).

## Compact source pass (Step 6)
- Reduced the release tree from 115 to exactly 100 files without combining unrelated runtime modules.
- Removed eight legacy/unreferenced React admin/UI components after repository-wide reference checks.
- Removed three unused duplicate original brand assets; the referenced optimized `*-web.*` assets remain.
- Removed four superseded intermediate audit notes; current README, Cloudflare deployment notes and this cumulative Step 5/6 audit remain.
- No API endpoint, migration, active page, active admin manager, runtime configuration, or referenced media asset was removed in this compact pass.

