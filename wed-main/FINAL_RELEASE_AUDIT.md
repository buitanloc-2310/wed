# BÁO CÁO NGHIÊN CỨU CHUYÊN SÂU, KIỂM TOÁN KỸ THUẬT VÀ NGHIỆM THU NÂNG CẤP WEBSITE
## TRANG THÔNG TIN ĐIỆN TỬ SKY FIRST (SKY FIRST NETWORK)

- **Tên hiển thị chính thức của Website**: **Trang Thông Tin Điện Tử Sky First**
- **Đơn vị chủ quản / Tổ chức**: **Mạng lưới Giáo dục và Phát triển Cộng đồng Sky First – Sky First Network (SFN)**
- **Tên miền chính thức**: `https://skyfirst.io.vn`
- **Tổng số tệp trong gói mã nguồn bàn giao**: **69 tệp** (đạt chuẩn giới hạn nghiêm ngặt `<= 69` tệp theo Phần XIV Mục 60).

---

## PHẦN I. BÁO CÁO NGHIÊN CỨU CHUYÊN SÂU 12 MỤC (PHỤ LỤC NGHIÊN CỨU XII)

### 1. Danh sách các Website và Tài liệu Kỹ thuật đã Nghiên cứu Đối chiếu
Quá trình nghiên cứu chuyên sâu được thực hiện trên 5 nhóm nền tảng thực tế và tài liệu tiêu chuẩn quốc tế:
1. **Nhóm Báo chí Điện tử & Tòa soạn Hội tụ**:
   - [Báo Thanh Niên Điện tử](https://thanhnien.vn/) (`https://thanhnien.vn/`): Nghiên cứu cách tổ chức bản tin tiêu điểm (Lead Story), cụm tin phụ (Sub-lead), dòng sự kiện, sapo in đậm tách biệt với thân bài, chú thích ảnh nghiêng kèm nguồn và trình đọc báo bằng giọng nói tiếng Việt.
2. **Nhóm Tổ chức Thanh niên, Tình nguyện & Phát triển Cộng đồng**:
   - [United Nations Volunteers (UNV)](https://www.unv.org/) (`https://www.unv.org/`) và [United Nations](https://www.un.org/en/) (`https://www.un.org/en/`): Nghiên cứu cách trình bày sứ mệnh tổ chức minh bạch, phân luồng cơ hội tình nguyện theo đối tượng, công bố báo cáo tác động có kiểm chứng và hiển thị thông tin pháp lý/minh bạch rõ ràng.
3. **Nhóm Nền tảng Giáo dục & Học thuật Mở**:
   - [edX](https://www.edx.org/) (`https://www.edx.org/`) và [Khan Academy](https://www.khanacademy.org/) (`https://www.khanacademy.org/`): Nghiên cứu cách thiết kế thẻ chương trình học tập có cấu trúc (đối tượng, thời lượng, đơn vị phụ trách, trạng thái đăng ký) và chế độ đọc tập trung không gây xao nhãng.
4. **Nhóm Hệ thống Quản trị Nội dung (CMS) & Biên tập Khối**:
   - [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/) (`https://developer.wordpress.org/block-editor/`): Nghiên cứu kiến trúc trình soạn thảo theo khối (Gutenberg Blocks), thư viện mẫu bài viết theo mục đích (Block Patterns/Templates), bộ kiểm tra chất lượng trước xuất bản (Pre-publish QA Checklist) và đồng bộ hai chiều qua WordPress REST API (`/wp-json/wp/v2/posts`).
5. **Nhóm Tiêu chuẩn Khả năng Tiếp cận, SEO Báo chí, Giọng nói & Hạ tầng**:
   - [W3C WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/) (`https://www.w3.org/TR/WCAG22/`): Tiêu chuẩn tương phản màu sắc tối thiểu `4.5:1`, điều hướng bàn phím (`:focus-visible`), hỗ trợ `prefers-reduced-motion` và chống cắt chữ khi phóng to đến 200%.
   - [Google Search Central — Structured Data & BreadcrumbList](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) (`https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`): Quy chuẩn dữ liệu có cấu trúc JSON-LD (`WebSite`, `Organization`, `NewsArticle`, `BreadcrumbList`).
   - [MDN Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) (`https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API`): Cơ chế tổng hợp giọng nói `window.speechSynthesis` và `SpeechSynthesisUtterance` cho thuyết minh tiếng Việt (`vi-VN`).
   - [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/) & [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/): Kiến trúc cơ sở dữ liệu SQL phân tán và lưu trữ đối tượng media không tính phí băng thông ra.

### 2. Phân tích Chi tiết Điểm mạnh của Từng Nhóm Website Tham chiếu
| Nhóm tham chiếu | Điểm mạnh cốt lõi được rút ra | Ứng dụng vào Trang Thông Tin Điện Tử Sky First |
| :--- | :--- | :--- |
| **Báo chí điện tử** ([Thanh Niên](https://thanhnien.vn/)) | Phân cấp thị giác rõ giữa tin tiêu điểm và tin danh sách; sapo tóm tắt súc tích; trình nghe đọc bài viết tiếng Việt ngay dưới tiêu đề; mục lục nhanh cho bài dài. | Tích hợp trình đọc bài viết bằng giọng nói tiếng Việt (`0.85x - 1.25x`), thanh tiến độ đọc bài, mục lục tự động (`tocItems`) và chế độ đọc tập trung tại `src/pages/NewsDetailPage.tsx`. |
| **Tổ chức thanh niên & cộng đồng** ([UNV](https://www.unv.org/), [UN](https://www.un.org/en/)) | Minh bạch tuyệt đối về tư cách tổ chức; phân luồng rõ người học, tình nguyện viên, thành viên nòng cốt (Core Team) và đối tác đồng hành. | Giữ vững tuyên bố minh bạch pháp lý tại `/phap-ly-minh-bach` và `/cong-khai`; phân luồng biểu mẫu độc lập theo từng chương trình tại `src/pages/CustomPageDetail.tsx`. |
| **Nền tảng giáo dục** ([edX](https://www.edx.org/), [Khan Academy](https://www.khanacademy.org/)) | Thẻ chương trình rõ trạng thái, đơn vị chủ trì (SFEC / Văn phòng / các Ban), bộ lọc tìm kiếm nhanh và không cắt ảnh học liệu/infographic. | Mặc định chế độ hiển thị ảnh `original` / `contain` không cắt xén poster/A4 kèm `ImageLightboxModal` phóng to 100% và tìm kiếm tiếng Việt không dấu tại `src/pages/ProgramsPage.tsx`. |
| **Hệ thống CMS & Gutenberg** ([WordPress Block Editor](https://developer.wordpress.org/block-editor/)) | Soạn thảo trực quan kết hợp Rich Text và các khối nội dung (Heading, Quote, Callout, Gallery, Video, Table, CTA) kèm kiểm tra chất lượng trước khi xuất bản. | Bổ sung 12 mẫu bài viết theo mục đích, bộ kiểm tra chất lượng 6 tiêu chí (Editorial QA Checklist), tạo tóm tắt mạng xã hội và xem trước PC/Mobile tại `src/components/admin/AdminNewsManager.tsx`. |

### 3. Bảng Đối chiếu với Hiện trạng Website Trước Khi Sửa
| Hạng mục đối chiếu | Hiện trạng trước nâng cấp | Sau khi nâng cấp & chuẩn hóa |
| :--- | :--- | :--- |
| **Tên hiển thị Website** | Đang dùng `"Sky First Network"` chung cho cả tên tổ chức và tên website, dễ gây lẫn lộn. | Đổi thống nhất tên hiển thị website sang **Trang Thông Tin Điện Tử Sky First**, giữ nguyên tên tổ chức **Mạng lưới Giáo dục và Phát triển Cộng đồng Sky First – Sky First Network**. |
| **Kịch bản Intro Thương hiệu** | Chỉ có hiệu ứng hiện logo đơn giản 1.4 giây và câu tagline ngắn, thiếu 6 giai đoạn và thiếu thuyết minh tiếng Việt. | Hoàn thiện **6 giai đoạn chuẩn** (Xuất hiện → Xoay tròn 360° dừng chính giữa → Hiện & đọc tên đầy đủ → Hiện & đọc tuần tự 4 vế khẩu hiệu → Giữ khung hình → Chuyển mượt vào trang chủ). |
| **Đọc bài viết bằng giọng nói** | Chưa có tính năng nghe bài viết bằng giọng nói tiếng Việt trên trang chi tiết tin tức. | Tích hợp trình phát giọng nói tiếng Việt (`Play`, `Pause`, `Resume`, `Stop`, tốc độ `0.85x / 1.0x / 1.15x / 1.25x`), chỉ đọc tiêu đề + sapo + thân bài. |
| **Mục lục tự động & Đọc tập trung** | Bài viết dài chưa có mục lục tự động, thanh tiến độ đọc bài hoặc chế độ đọc tập trung. | Tự động tạo Mục lục (`tocItems`) khi có từ 2 tiêu đề phụ, thêm thanh tiến độ đọc ở đỉnh trang, nút `Đọc tập trung` và nút `Lưu bài` (`localStorage`). |
| **Mẫu bài viết & Kiểm tra biên tập** | Trình quản trị tin tức mới có 1 mẫu mặc định khi bấm tạo mới, chưa có bảng chấm điểm QA bài viết. | Tích hợp **12 mẫu bài viết theo mục đích**, bảng **Kiểm tra chất lượng bài viết (6 tiêu chí)**, tạo tóm tắt MXH và xem trước PC/Mobile. |
| **Tìm kiếm Tiếng Việt** | Chỉ khớp chuỗi có dấu chính xác (`includes`), gõ không dấu không tìm thấy bài có dấu. | Hỗ trợ tìm kiếm tiếng Việt cả có dấu và không dấu (`normalize('NFD')`) trên toàn bộ thanh tìm kiếm Header, trang Tin tức và trang Chương trình. |

### 4. Danh sách Lỗi và Hạn chế Đã Tìm Thấy & Khắc Phục
1. **Chưa tách biệt tên hiển thị website và tên tổ chức**: Đã rà soát toàn bộ 69 tệp và phân loại chính xác từng vị trí để chuyển tên hiển thị website sang `Trang Thông Tin Điện Tử Sky First` mà không làm sai lệch nội dung pháp lý/lịch sử của `Sky First Network`.
2. **Intro trang chủ thiếu khẩu hiệu 4 vế chính thức và giọng đọc**: Đã nâng cấp `HomepageIntroOverlay` trong `src/components/UIPrimitives.tsx` với đầy đủ 6 giai đoạn, khẩu hiệu 4 vế chính thức và Web Speech API có cơ chế dự phòng an toàn khi trình duyệt chặn autoplay.
3. **Nguy cơ cắt dấu tiếng Việt ở tiêu đề in hoa trên màn hình nhỏ**: Đã gia cố `line-height >= 1.28`, `padding-top/bottom: 0.04em` và `overflow-wrap: anywhere` trong `src/index.css`.

### 5. Kiến trúc Thông tin và Sơ đồ Chuyên mục Đề xuất & Áp dụng
- **5 Cụm điều hướng chính trên Header (`Navbar`)**:
  1. **Trang chủ** (`/home`)
  2. **Giới thiệu**: Về Sky First Network (`/sky-first-network-la-gi`), Tầm nhìn & Sứ mệnh (`/tam-nhin-su-menh`), Giá trị cốt lõi (`/gia-tri-cot-loi`), Cơ cấu tổ chức (`/co-cau-to-chuc`), Ban Điều hành & Con người Sky First (`/con-nguoi`), Đơn vị trực thuộc (`/units`), Hành trình phát triển (`/hanh-trinh-hinh-thanh`), Báo cáo & Dấu ấn (`/bao-cao-dau-an`), Liên hệ (`/contact`).
  3. **Hoạt động** (Mega Menu 3 cột): Giáo dục & Đào tạo, Phát triển Người trẻ, Tình nguyện & Cộng đồng, Môi trường & Phát triển bền vững, Nghiên cứu & Đổi mới sáng tạo, Chương trình & Dự án (`/programs`), Sự kiện & Hoạt động (`/su-kien`), Kết nối & Hợp tác (`/ket-noi-hop-tac`), Truyền thông & Lan tỏa (`/truyen-thong-lan-toa`), Cơ hội đang mở (`/co-hoi`).
  4. **Tra cứu**: Tra cứu hồ sơ đăng ký (`/join`), Tra cứu chương trình/dự án (`/programs`), Công khai & Minh bạch (`/cong-khai`), Tài liệu công khai (`/tai-lieu-cong-khai`), Báo cáo hoạt động (`/bao-cao-hoat-dong`), Báo cáo tác động (`/bao-cao-tac-dong`), Câu hỏi thường gặp (`/cau-hoi-thuong-gap`).
  5. **Tham gia & Tin tức**: Phân luồng Thành viên, Core Team, Tình nguyện viên, TNV Dạy học, Hợp tác & Đồng hành, Gửi sáng kiến và hệ thống 17 chuyên mục tin tức chuẩn hóa.

### 6. Phương án Thiết kế Giao diện và Quy chuẩn Chống Cắt Chữ
- **Bảng màu thương hiệu**: Xanh dương chủ đạo `#0B66C3` / `#0284C7`, Xanh navy đậm `#071B3A` / `#061A3A`, Điểm nhấn Cyan `#22D3EE`, nền sáng `#FFFFFF` và `#F8FAFC`, chữ nội dung `#0F172A` / `#334155` đạt độ tương phản chuẩn [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/).
- **Quy chuẩn Typography Tiếng Việt**: Phông chữ `Be Vietnam Pro` hỗ trợ đầy đủ dấu thanh tiếng Việt; tiêu đề không dùng `overflow: hidden` với chiều cao cố định; mọi nhãn danh mục (`EntityBadge`) đều cho phép `whitespace-normal break-words`.
- **Quy chuẩn Hình ảnh**: Mặc định giữ nguyên tỷ lệ gốc (`objectFit="original"`), tuyệt đối không tự động cắt mất chữ trên poster dọc, ảnh A4 hay infographic; tích hợp `ImageLightboxModal` xem ảnh gốc 100%.

### 7. Phương án Nâng cấp Trình Biên Tập Bài Viết & 12 Mẫu Bài Viết
- Kết hợp trình soạn thảo WYSIWYG (`RichTextEditor.tsx` hỗ trợ dán từ Word/Google Docs sạch mã rác, kéo thả ảnh tự động tải lên R2, tạo bảng, trích dẫn, hộp thông tin, danh sách kiểm tra) và các khối Gutenberg (`PageBlock`).
- Cung cấp **12 mẫu bài viết dựng sẵn** trong `AdminNewsManager.tsx` (từ Tin tức hoạt động, Thông báo chính thức, Tuyển thành viên/TNV đến Báo cáo tác động và Longform/e-Magazine).
- Bổ sung **Bảng Kiểm tra Chất lượng Bài viết (6 tiêu chí)** tự động kiểm tra độ dài tiêu đề, sapo, ảnh đại diện + alt/caption, tác giả/ngày đăng/thẻ, quy tắc tên gọi tổ chức và liên kết hợp lệ.

### 8. Phương án Triển khai Tính năng Đọc Bài Viết Bằng Giọng Nói Tiếng Việt
- Sử dụng [MDN Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) (`window.speechSynthesis` và `SpeechSynthesisUtterance`) ngay trong `src/pages/NewsDetailPage.tsx`.
- Tự động tách bài viết thành các phân đoạn sạch (`speechSegments`): Tiêu đề bài viết → Tóm tắt mở đầu (Sapo) → Từng đoạn văn nội dung chính và khối nội dung; loại bỏ hoàn toàn thẻ HTML, chú thích ảnh phụ, menu và footer.
- Hỗ trợ đầy đủ điều khiển: `Nghe bài viết`, `Tạm dừng`, `Tiếp tục nghe`, `Dừng`, chọn tốc độ `0.85x / 1.0x / 1.15x / 1.25x` và hiển thị trực tiếp câu/đoạn đang đọc.

### 9. Phương án Triển khai Intro Thương Hiệu 6 Giai Đoạn Có Giọng Đọc
- Triển khai tại `HomepageIntroOverlay` (`src/components/UIPrimitives.tsx`) và keyframes CSS tại `src/index.css`:
  - **Giai đoạn 1 (`appear`)**: Logo xuất hiện trên nền `#061A3A` với hiệu ứng quầng sáng `sfn-intro-aura`.
  - **Giai đoạn 2 (`rotate`)**: Logo xoay tròn mượt 360 độ với gia tốc `cubic-bezier(0.22, 0.61, 0.36, 1)` và dừng ổn định chính giữa.
  - **Giai đoạn 3 (`name`)**: Hiển thị dòng chữ `MẠNG LƯỚI GIÁO DỤC VÀ PHÁT TRIỂN CỘNG ĐỒNG SKY FIRST` + phát giọng đọc tiếng Việt: *"Mạng lưới Giáo dục và Phát triển Cộng đồng Sky First."*
  - **Giai đoạn 4 (`slogan`)**: Hiển thị tuần tự 4 ô khẩu hiệu theo từng nhịp đọc: `01 TIÊN PHONG SÁNG TẠO` → `02 KẾT NỐI TRI THỨC` → `03 KIẾN TẠO TƯƠNG LAI` → `04 VÌ MỘT CỘNG ĐỒNG BỀN VỮNG`, đồng thời đọc trọn vẹn cả 4 vế.
  - **Giai đoạn 5 (`hold`)**: Giữ khung hình hoàn chỉnh gồm logo, tên đầy đủ và 4 vế khẩu hiệu.
  - **Giai đoạn 6 (`exiting`)**: Chuyển cảnh mượt vào Trang chủ; luôn có nút `Bỏ qua Intro` (`Escape` hoặc click) và nút `Nghe thuyết minh` dự phòng khi trình duyệt chặn tự động phát âm thanh.

### 10. Phương án Bảo toàn WordPress REST API, Cloudflare D1, R2 và Firebase Auth
- **Cloudflare D1 (`DB`)**: Bảo toàn nguyên vẹn cấu hình trong `wrangler.jsonc` (`database_name: "wed"`, `database_id: "942c7ed9-fd5e-458c-a71f-977269a4ec34"`) cùng 2 tệp migration `0001_initial_schema.sql` và `0002_system_automation_analytics.sql` (không có bất kỳ lệnh `DROP TABLE` hay `TRUNCATE` nào).
- **Cloudflare R2 (`MEDIA`)**: Bảo toàn bucket `wed` và các endpoint `/api/media`, `/api/media/upload`, `/media/[[path]]` kèm kiểm tra chữ ký MIME thực tế và khóa an toàn khi ảnh đang được bài viết tham chiếu.
- **Firebase Authentication**: Bảo toàn dự án `skyfirstnetwork` và xác thực JWT RS256 phía server (`functions/_firebaseAdmin.js`, `functions/_auth.js`) cùng phân quyền RBAC (`owner`, `admin`, `editor`, `program_manager`, `reviewer`, `viewer`).
- **WordPress CMS Sync**: Bảo toàn nguyên vẹn luồng đồng bộ bài viết từ WordPress qua REST API (`/wp-json/wp/v2/posts?_embed=1`) tại `functions/api/cms.js` (`action=wordpress-sync` / `action=wordpress-status`).

### 11. Danh sách Những Thay Đổi Đã Thực Hiện Trực Tiếp Trong Mã Nguồn
1. `index.html`: Đổi tiêu đề trang, thẻ Open Graph `og:site_name`, `og:title` sang `Trang Thông Tin Điện Tử Sky First` và bổ sung JSON-LD `WebSite` + `Organization`.
2. `src/index.css`: Gia cố line-height tiếng Việt chống cắt dấu, thêm keyframes `sfnIntroSpinStop` và `sfnAuraBreath` cho Intro 6 giai đoạn, thêm `scroll-margin-top` cho tiêu đề mục lục.
3. `src/App.tsx`: Cập nhật `PAGE_TITLES` sang `| Trang Thông Tin Điện Tử Sky First`, bổ sung tiêm tự động JSON-LD `BreadcrumbList` và chuẩn hóa tên hiển thị website.
4. `src/context/DataContext.tsx`: Cập nhật `DEFAULT_SITE_CONFIG.siteName = 'Trang Thông Tin Điện Tử Sky First'`, cấu hình SEO/Email/Bảo trì mặc định, văn bản trang Chính sách bảo mật & Điều khoản sử dụng, và hàm `normalizeRemoteSiteConfig`.
5. `src/components/SiteChrome.tsx`: Hiển thị tên `Trang Thông Tin Điện Tử Sky First` trên Header, Drawer di động, Footer, màn hình bảo trì và nâng cấp tìm kiếm tiếng Việt không dấu (`foldVietnamese`).
6. `src/components/UIPrimitives.tsx`: Nâng cấp `HomepageIntroOverlay` lên chuẩn **Intro 6 giai đoạn** kèm thuyết minh tiếng Việt Web Speech API và gắn `id` tự động cho thẻ `<h2>`/`<h3>` trong `RichTextRenderer`.
7. `src/pages/NewsDetailPage.tsx`: Bổ sung trình đọc bài viết bằng giọng nói tiếng Việt (`0.85x - 1.25x`), thanh tiến độ đọc bài, mục lục tự động (`tocItems`), chế độ đọc tập trung (`focusMode`), lưu bài đọc sau (`localStorage`) và JSON-LD `NewsArticle`.
8. `src/pages/NewsPage.tsx` & `src/pages/ProgramsPage.tsx`: Bổ sung tìm kiếm tiếng Việt không dấu & có dấu (`foldVietnamese`) và bộ lọc `Bài đã lưu` trên trang Tin tức.
9. `src/components/admin/AdminNewsManager.tsx`: Bổ sung **12 mẫu bài viết theo mục đích**, **Bảng kiểm tra chất lượng bài viết (6 tiêu chí)**, nút **Tạo bản tóm tắt chia sẻ MXH** và **Chế độ xem trước PC / Mobile (390px)**.
10. `src/pages/AdminPage.tsx`, `src/components/admin/AdminSettings.tsx`, `functions/api/system.js`, `scripts/verify_release.py`: Đồng bộ tên hiển thị `Trang Thông Tin Điện Tử Sky First` và bổ sung kiểm tra tự động trong `verify_release.py`.

---

## PHẦN II. BÁO CÁO THỐNG NHẤT ĐỔI TÊN WEBSITE (PHỤ LỤC CUỐI CÙNG)

| Phân loại | Nội dung / Vị trí cụ thể | Giá trị áp dụng | Lý do kỹ thuật & nghiệp vụ |
| :--- | :--- | :--- | :--- |
| **Nhóm 1: Đã đổi sang `Trang Thông Tin Điện Tử Sky First`** | `<title>`, `og:site_name`, `og:title` (`index.html`); `PAGE_TITLES` (`src/App.tsx`); `DEFAULT_SITE_CONFIG.siteName`, `emailSettings.senderName`, `seoSettings.titleTemplate`, `footerPortals[0].label` (`src/context/DataContext.tsx`); Header, Mobile Menu, Footer, Màn hình bảo trì (`src/components/SiteChrome.tsx`); Dòng ghi nhận cuối bài báo (`src/pages/NewsDetailPage.tsx`); Tiêu đề đăng nhập & thanh quản trị (`src/pages/AdminPage.tsx`, `src/components/admin/AdminSettings.tsx`); Biến `site_name` và tiêu đề email kiểm tra (`functions/api/system.js`). | **Trang Thông Tin Điện Tử Sky First** | Đây là các vị trí thể hiện tên gọi của cổng thông tin / website công khai và hệ thống quản trị website theo đúng Phụ lục Cuối cùng. |
| **Nhóm 2: Giữ nguyên `Sky First Network` (Tên tổ chức)** | Tên đầy đủ `Mạng lưới Giáo dục và Phát triển Cộng đồng Sky First – Sky First Network` trong Intro (`src/components/UIPrimitives.tsx`), hồ sơ pháp lý & minh bạch (`/phap-ly-minh-bach`), bài giới thiệu `Sky First Network là gì?` (`src/data/baselineData.ts`), chức danh `Chủ tịch Sky First Network`, `Ban Chấp hành Sky First Network`, `Core Team Sky First Network`, `Văn phòng Sky First Network`. | **Sky First Network** / **Mạng lưới Giáo dục và Phát triển Cộng đồng Sky First** | Thuộc về tên gọi chính thức của tổ chức/mạng lưới, lịch sử hình thành và cơ cấu nhân sự; không phải tên riêng của website. |
| **Nhóm 3: Giữ nguyên Định danh Kỹ thuật & Hạ tầng** | `package.json` (`"name": "sky-first-network-website"`), `wrangler.jsonc` (`name: "wed"`, D1 `DB` -> `wed`, R2 `MEDIA` -> `wed`), `FIREBASE_PROJECT_ID: "skyfirstnetwork"`, tên miền `skyfirst.io.vn`, email `*@skyfirst.io.vn`, file logo `/brand/sky-first-network-web.png`, đường dẫn `/sky-first-network-la-gi`. | Giữ nguyên 100% | Bảo toàn tuyệt đối kết nối cơ sở dữ liệu D1, lưu trữ R2, xác thực Firebase, SEO URLs và cấu hình triển khai Cloudflare Pages. |

---

## PHẦN III. BẢNG BẰNG CHỨNG KIỂM TRA & NGHIỆM THU (PHỤ LỤC KỸ THUẬT BẮT BUỘC MỤC G)

| STT | Hạng mục kiểm tra | Trạng thái | Tệp liên quan | Kết quả kiểm chứng thực tế |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Giới hạn số lượng tệp bàn giao (`<= 69` tệp)** | **PASS (69/69 tệp)** | Toàn bộ kho mã nguồn & gói ZIP | `python3 scripts/verify_release.py` xác nhận chính xác **69 tệp**, không chứa `node_modules`, `dist`, `.git`, `__pycache__`. |
| 2 | **Kiểm tra liên kết Module &Biên dịch TypeScript/React** | **PASS** | 29 tệp `.ts/.tsx` trong `src/` & 17 tệp `.js` trong `functions/` | 163 relative imports hợp lệ (0 liên kết gãy); 17/17 tệp Functions đạt `node --check`; 29/29 tệp TS/TSX biên dịch sạch qua Babel (`@babel/preset-typescript` + `@babel/preset-react`). |
| 3 | **Kiểm thử tích hợp Backend, CMS, Forms, Email, Backup & Security** | **PASS (17/17 tests)** | `tests/backend.test.mjs`, `functions/api/*.js` | Chạy `node --test tests/backend.test.mjs` đạt **17/17 pass (0 fail)**: kiểm증 RBAC, lưu cấu hình & lịch sử phiên bản, xuất bản hẹn giờ, kiểm tra chữ ký MIME ảnh R2, biểu mẫu độc lập, hàng đợi email, thống kê truy cập, sao lưu SHA-256 và tương thích lược đồ D1 cũ. |
| 4 | **Bảo toàn Cloudflare D1, R2, Firebase Auth & WordPress Sync** | **PASS** | `wrangler.jsonc`, `migrations/*.sql`, `functions/api/cms.js` | Giữ nguyên binding `DB` (`942c7ed9-fd5e-458c-a71f-977269a4ec34`), `MEDIA` (`wed`), `FIREBASE_PROJECT_ID` (`skyfirstnetwork`) và đồng bộ WordPress REST API (`action=wordpress-sync`). |
| 5 | **Thống nhất đổi tên Website sang `Trang Thông Tin Điện Tử Sky First`** | **PASS** | `index.html`, `src/App.tsx`, `src/context/DataContext.tsx`, `src/components/SiteChrome.tsx`, `src/pages/*` | Đã kiểm chứng tự động qua `verify_release.py` và rà soát toàn bộ các vị trí hiển thị tên website công khai, quản trị, SEO, Open Graph và JSON-LD. |
| 6 | **Intro Thương hiệu 6 Giai đoạn & Giọng đọc Tiếng Việt** | **PASS** | `src/components/UIPrimitives.tsx`, `src/index.css` | Đủ 6 giai đoạn, hiển thị đúng tên đầy đủ và 4 vế khẩu hiệu tuần tự, tích hợp `window.speechSynthesis` (`vi-VN`), nút `Nghe thuyết minh` và nút `Bỏ qua Intro` hoạt động tức thì. |
| 7 | **Trình đọc bài viết bằng giọng nói, Mục lục tự động & Đọc tập trung** | **PASS** | `src/pages/NewsDetailPage.tsx` | Hỗ trợ Play/Pause/Resume/Stop, tốc độ `0.85x - 1.25x`, chỉ đọc nội dung bài viết, tự sinh mục lục khi có `>= 2` tiêu đề phụ, có thanh tiến độ đọc và lưu bài đọc sau. |
| 8 | **12 Mẫu bài viết theo mục đích & Trợ lý Kiểm tra Chất lượng (QA)** | **PASS** | `src/components/admin/AdminNewsManager.tsx` | Đủ 12 mẫu bài viết chuẩn báo chí/tổ chức, bảng kiểm tra 6 tiêu chí chất lượng thời gian thực, tạo tóm tắt MXH và xem trước PC/Mobile. |
| 9 | **Lệnh `npm ci` / `npm run build` trực tiếp kết nối Registry ngoài** | **GIỚI HẠN MÔI TRƯỜNG SANDBOX OFFLINE** | `package.json`, `package-lock.json`, `scripts/verify_release.py` | Môi trường máy ảo kiểm thử bị tắt kết nối Internet ra ngoài theo chính sách an toàn hệ thống nên không tải trực tiếp `node_modules` từ registry npm. Đã xác minh tính hợp lệ cú pháp/kiểu của toàn bộ 29 tệp TS/TSX bằng trình biên dịch Babel cài sẵn trong máy ảo và kiểm thử thực tế toàn bộ 17 bài test backend bằng `node --test`. Khi triển khai trên Cloudflare Pages có kết nối npm registry, lệnh `npm ci && npm run build` sử dụng `package-lock.json` đã khóa chuẩn sẽ biên dịch ra `dist/`. |
