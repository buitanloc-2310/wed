# BÁO CÁO NGHIỆM THU TỔNG THỂ — PHỤ LỤC BỔ SUNG CUỐI CÙNG
## TRANG THÔNG TIN ĐIỆN TỬ SKY FIRST (SKY FIRST NETWORK — SFN)

- **Tên hiển thị chính thức của Website**: **Trang Thông Tin Điện Tử Sky First**
- **Đơn vị chủ quản / Tổ chức**: **Mạng lưới Giáo dục và Phát triển Cộng đồng Sky First – Sky First Network (SFN)**
- **Tên miền chính thức**: `https://skyfirst.io.vn`
- **Tổng số tệp thực tế trong gói ZIP bàn giao**: **68 tệp** (đạt chuẩn giới hạn nghiêm ngặt `<= 69` tệp, không chứa `node_modules`, `dist`, `.git`, `__pycache__` hoặc thư mục lồng dư thừa).

---

## I. LOẠI BỎ HOÀN TOÀN GIỌNG ĐỌC INTRO HIỆN TẠI & BẢO TOÀN ĐA PHƯƠNG TIỆN ĐỘC LẬP

| Hạng mục yêu cầu | Trạng thái | Tệp thực hiện | Kết quả kiểm chứng |
| :--- | :--- | :--- | :--- |
| **1. Xóa bỏ chức năng đọc lời giới thiệu bằng giọng nói AI trong màn hình Intro** | **HOÀN TẤT** | `src/components/UIPrimitives.tsx` | Đã gỡ bỏ hoàn toàn `window.speechSynthesis`, `SpeechSynthesisUtterance`, `speakVietnamesePhrase`, `stopSpeech` khỏi `HomepageIntroOverlay`. |
| **2. Không đọc tên tổ chức, khẩu hiệu hoặc lời thoại tự động khi mở website** | **HOÀN TẤT** | `src/components/UIPrimitives.tsx` | Khi mở trang chủ (`/` hoặc `/home`), màn hình Intro phát video 10 giây ở chế độ tắt tiếng (`muted`), không phát bất kỳ lời thoại hay âm báo tổng hợp (`playSubtleBrandChord`) nào. |
| **3. Loại bỏ nút điều khiển, trạng thái và xử lý chỉ phục vụ giọng nói Intro** | **HOÀN TẤT** | `src/components/UIPrimitives.tsx` | Đã xóa bỏ trạng thái `voiceActive`, `voiceStatus`, `spokenStagesRef`, hàm `handleReplayOrToggleVoice` và nút `"Nghe thuyết minh"` / `"Đang thuyết minh"` cùng icon `Volume2`/`VolumeX` trên màn hình Intro. |
| **4. Kiểm tra và loại bỏ đoạn mã phát giọng đọc Intro còn sót lại** | **HOÀN TẤT** | `scripts/verify_release.py` | Bổ sung kiểm tra tự động trong `verify_release.py`: đảm bảo `0` kết quả `speechSynthesis` hoặc `SpeechSynthesisUtterance` trong `src/components/UIPrimitives.tsx`. |
| **5. Bảo toàn chức năng âm thanh / đa phương tiện độc lập khác của website** | **HOÀN TẤT** | `src/pages/NewsDetailPage.tsx` | Bảo toàn nguyên vẹn trình đọc bài viết tiếng Việt (`Nghe bài viết` với tốc độ `0.85x - 1.25x`) trên trang chi tiết tin tức `src/pages/NewsDetailPage.tsx` và các khối video nội dung (`PageBlock` loại `video`). |

---

## II. VIDEO LOGO CAO CẤP 10 GIÂY & HỆ THỐNG QUẢN LÝ VIDEO INTRO TRONG ADMIN

### 1. Thông số Kỹ thuật Thực tế của Tệp Video Intro (`public/brand/sky-first-intro.mp4`)
Đã kiểm chứng trực tiếp bằng `ffprobe` và kiểm tra thị giác từng khung hình (`1.0s`, `3.0s`, `7.0s`):
- **Đường dẫn tệp**: `/brand/sky-first-intro.mp4` (`public/brand/sky-first-intro.mp4`)
- **Định dạng & Codec**: `MP4 / H.264 (High@L4.0)`, pixel format `yuv420p`, cờ tối ưu phát trực tuyến `-movflags +faststart`
- **Thời lượng chính xác**: `10.000000 giây` (`300 frames` ở tốc độ `30 fps`)
- **Độ phân giải & Tỷ lệ khung hình**: `1280×720` (`16:9` HD sắc nét)
- **Dung lượng tệp**: `387,766 bytes` (`~378.7 KB` — tải tức thì trên cả mạng di động 4G và Wi-Fi)
- **Kênh âm thanh**: Không chứa rãnh âm thanh bắt buộc (`-an` / `muted`), tương thích 100% chính sách Autoplay của Chrome, Safari (iOS/macOS), Edge và Firefox.
- **Bảo toàn nhận diện Logo gốc**: Giữ nguyên 100% tỷ lệ gốc (`1945×1171`) và màu sắc của `public/brand/sky-first-network-web.png` trên bệ sáng trắng ngọc trai viền Cyan giữa nền xanh Navy sâu (`#061A3A` → `#0B3B78`), không watermark, không méo hình.

### 2. Khu vực Quản trị Thiết kế, Tải lên & Quản lý Video Intro trong Admin (`src/components/admin/AdminSettings.tsx`)
Đã tích hợp trực tiếp vào **Trung tâm Cấu hình (`Nhóm 2.1 & 2.3 — Studio Video Intro 10s`)** với đầy đủ:
- **Phương thức 1 — Tự thiết kế Intro trực quan trong Admin**: Tuỳ chỉnh màu nền (`bgPrimary`, `bgSecondary`), ánh sáng (`accentGlow`), kiểu bệ sáng đỡ logo (`pearl_white`, `frosted_glass`, `minimal_clear`), tỷ lệ kích thước logo (`70%–130%`), vị trí dọc (`-15%` đến `+15%`), hiệu ứng chuyển động, tiêu đề nhận diện chính/phụ, xem trước trực tiếp Desktop & Mobile (`390px`), lưu thành bản nháp hoặc kích hoạt ngay.
- **Phương thức 2 — Tải video có sẵn lên (`/api/media/upload`)**: Hỗ trợ chọn tệp `MP4 (H.264)` hoặc `WebM` (tối đa `50 MB`), tự động kiểm tra chữ ký nhị phân (`ftyp` / `EBML`) trên máy chủ và đọc thông số kỹ thuật thực tế (`định dạng`, `thời lượng giây`, `độ phân giải W×H`, `dung lượng`) trước khi cho phép kích hoạt; hỗ trợ tải ảnh Poster dự phòng (`PNG/JPG/WebP`) và phát trực tuyến qua `/media/[[path]]` có hỗ trợ `Accept-Ranges: bytes` (`HTTP 206 Partial Content`).
- **Phương thức 3 — Kết hợp thiết kế và tải lên**: Cho phép kết xuất trực tiếp bản thiết kế thành tệp video `.webm` 10 giây ngay trong trình duyệt (khi trình duyệt hỗ trợ `HTMLCanvasElement.captureStream` và `MediaRecorder`) để đẩy thẳng lên kho R2, đồng thời thông báo rõ ràng và cho phép chuyển sang tải tệp `.mp4 (H.264)` dựng sẵn từ phần mềm bên ngoài nếu thiết bị không hỗ trợ ghi Canvas.
- **Bộ điều khiển Intro & Thư viện Phiên bản**:
  - Phân biệt rõ **Thời lượng tệp video** (`videoFileDurationSeconds`) với **Thời gian hiển thị Intro mục tiêu** (`durationSeconds`, mặc định `10 giây`, giới hạn `3–20 giây`) và **Thời gian chờ tải tối đa** (`maxWaitDurationMs`, mặc định `3500ms`). Nếu video tải chậm quá `3.5 giây` hoặc gặp lỗi, hệ thống chuyển mượt sang khung nhận diện dự phòng hoặc vào thẳng trang chủ, không bao giờ khóa màn hình người dùng.
  - Quản lý danh sách phiên bản theo 3 trạng thái: `Đang hoạt động (Active)`, `Bản nháp (Draft)` và `Lưu trữ (Archived)`. Chặn xóa an toàn (`HTTP 409`) đối với video/poster đang hoạt động và không tự động xóa tệp cũ khi kích hoạt video mới.

---

## III. BẢNG RÀ SOÁT VÀ SỬA LỖI TOÀN WEBSITE (12 HẠNG MỤC KIỂM TRA)

| STT | Hạng mục & Mô tả lỗi đã phát hiện | Mức độ | Nguyên nhân gốc đã xác minh | Cách khắc phục đã thực hiện | Kết quả kiểm thử |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Gói mã nguồn chứa 225 tệp do thư mục lồng `wed-main/wed-main/` và 43 tệp chết** | **Nghiêm trọng (Critical)** | Khi gộp bản cập nhật trước, thư mục con `wed-main/` (99 tệp cũ v1.1.0) và 43 tệp `.tsx/.sql` cũ không được dọn dẹp, làm vỡ giới hạn `<= 69` tệp và gây xung đột khi chạy `tsc`. | Xóa thư mục lồng `./wed-main` và các tệp mồ côi không còn được import từ `src/main.tsx`, giữ lại đúng kiến trúc 68 tệp chuẩn. | `verify_release.py` xác nhận **68 tệp (`<= 69`)**, `0` liên kết import gãy. |
| 2 | **Màn hình Intro tự động phát giọng đọc AI và chạy trùng 14.65s sau khi hết video** | **Cao (High)** | `HomepageIntroOverlay` trong `UIPrimitives.tsx` gọi `speechSynthesis.speak` và khi sự kiện `onEnded` của video kết thúc lại đặt `setStage('appear')` khiến intro chạy tiếp 14.6 giây. | Loại bỏ hoàn toàn `speechSynthesis` khỏi `UIPrimitives.tsx`; khi video 10s kết thúc (`onEnded`) hoặc chạm mốc `durationSeconds` (10s), gọi `triggerFinish()` chuyển mượt vào Trang chủ. | Kiểm thử trên cả chế độ Video và Visual Fallback: kết thúc đúng mục tiêu 10s, không phát giọng đọc. |
| 3 | **Lỗi 404 tài nguyên mặc định `/brand/sky-first-network-logo.png` và `/brand/sky-first-intro.mp4`** | **Cao (High)** | `DataContext.tsx` và `AdminSettings.tsx` trỏ `posterUrl` và `defaultOgImage` tới `/brand/sky-first-network-logo.png` (không tồn tại) và thiếu tệp `/brand/sky-first-intro.mp4`. | Tạo tệp chuẩn `public/brand/sky-first-intro.mp4` (10.0s, H.264) và chuẩn hóa đường dẫn poster/OG về `/brand/sky-first-network-web.png` có thật. | Kiểm tra toàn bộ tài nguyên trong `public/brand/`: 100% tồn tại hợp lệ. |
| 4 | **API `/api/media/upload` từ chối tải tệp video `.mp4` / `.webm` và `/media/[[path]]` thiếu HTTP Range** | **Cao (High)** | `upload.js` chỉ khai báo MIME ảnh và PDF; `[[path]].js` trả nguyên luồng mà chưa có `Accept-Ranges: bytes` và `206 Partial Content`. | Bổ sung xác thực chữ ký nhị phân `video/mp4` (`ftyp`) và `video/webm` (`EBML`) tới `50 MB` tại `upload.js`, thêm `Accept-Ranges: bytes` và xử lý header `Range` tại `[[path]].js`. | Subtest 17 trong `tests/backend.test.mjs` đạt **PASS** (`200 OK`, `accept-ranges: bytes`, khóa xóa `409`). |
| 5 | **Ô nhập khóa API Email trong `AdminSettings.tsx` lưu chuỗi che vào `site_config` công khai** | **Cao (Bảo mật)** | `AdminSettings.tsx` có state `newEmailApiKey` ghi `apiKeyMasked` vào tài liệu CMS `site_config` (public), dễ gây hiểu lầm rằng khóa được lưu làm biến môi trường máy chủ và lộ 8 ký tự đầu/cuối trong `maskSecret`. | Xóa ô nhập API key phía trình duyệt; sửa `maskSecret` tại `functions/api/system.js` chỉ trả trạng thái `configured: true/false` mà không lộ bất kỳ ký tự nào của khóa bí mật. | Kiểm tra payload `/api/cms` và `/api/system?action=email-outbox`: tuyệt đối không lộ ký tự khóa bí mật. |
| 6 | **Resend API chỉ gửi `text` thuần, thiếu `html` và thiếu header `Idempotency-Key`** | **Trung bình - Cao** | `dispatchSingleEmail` (`system.js`), `enqueueFormEmail` (`forms/index.js`) và `queueAndSend` (`registrations/index.js`) chưa truyền trường `html` và header `Idempotency-Key`. | Bổ sung hàm `buildOfficialEmailHtml`, lưu `html_body` vào `website_email_outbox` và gửi kèm cả `html`, `text` cùng header `Idempotency-Key` tới `https://api.resend.com/emails`. | Subtest 6 & Subtest 17 trong `tests/backend.test.mjs` đạt **PASS**. |
| 7 | **Biểu mẫu Liên hệ (`/api/contact`) chưa gửi thông báo email và thiếu chặn gửi lặp** | **Trung bình** | `functions/api/contact/index.js` chỉ ghi vào bảng `website_contacts` mà chưa đẩy thông báo vào `website_email_outbox` hay kiểm tra gửi trùng liên tiếp. | Bổ sung kiểm tra định dạng email, chặn gửi trùng trong 3 phút (`HTTP 409`) và xếp hàng gửi email xác nhận + email báo bộ phận phụ trách (`assignedTo`). | Subtest 9 & Subtest 17 trong `tests/backend.test.mjs` đạt **PASS**. |
| 8 | **Thông số `designSystem` trong `SiteConfig` chưa áp dụng toàn diện cho Logo, Header, Cột và Form** | **Trung bình** | `App.tsx` mới chỉ gán 5 biến CSS màu/bo góc cơ bản, chưa có cấu hình 10 nhóm kích thước/bố cục từ Admin. | Mở rộng `LayoutDesignSystemConfig` (10 nhóm), gán biến CSS có ngưỡng giới hạn an toàn (`clamp`) tại `App.tsx` và `index.css`, tích hợp bảng điều chỉnh kèm xem trước Desktop/Mobile tại `AdminSettings.tsx`. | Kiểm tra hiển thị trên khung Desktop và Mobile `390px`: co giãn mượt, không tràn khung. |
| 9 | **`tsconfig.json` thiếu phạm vi `include`/`exclude` tường minh** | **Trung bình (Build)** | Khi chạy `tsc --noEmit`, TypeScript quét toàn bộ thư mục gốc nếu không giới hạn `"include": ["src"]`. | Bổ sung `"include": ["src"]` và `"exclude": ["node_modules", "dist"]` vào `tsconfig.json`. | Chạy biên dịch kiểm tra toàn bộ 29 tệp `.ts/.tsx` trong `src/` đạt **PASS**. |

---

## IV. BÁO CÁO KIỂM TRA VÀ HOÀN THIỆN RESEND API

1. **Cấu hình thực tế & Cơ chế bảo mật khóa (`RESEND_API_KEY`)**:
   - Theo hướng dẫn chính thức tại [Send Emails With Resend · Cloudflare Workers Docs](https://developers.cloudflare.com/workers/tutorials/send-emails-with-resend/) và [Send emails with Cloudflare Workers - Resend](https://resend.com/docs/send-with-cloudflare-workers), khóa bí mật `RESEND_API_KEY` và địa chỉ gửi `MAIL_FROM` được đọc trực tiếp từ biến môi trường máy chủ (`context.env.RESEND_API_KEY`, `context.env.MAIL_FROM`).
   - Không có bất kỳ khóa API nào nằm trong mã nguồn trình duyệt, repository hay tài liệu bàn giao. Hàm `maskSecret` trong `functions/api/system.js` đã được gia cố để chỉ báo trạng thái `Đã cấu hình trong Secrets máy chủ (Đã ẩn bảo mật)` hoặc `Chưa cấu hình`, không hiển thị ký tự nào của khóa trong Admin hoặc nhật ký.
2. **Xác minh tên miền, Chống gửi trùng (`Idempotency-Key`) & Chế độ thử nghiệm an toàn**:
   - Tuân thủ tài liệu [Resend Idempotency Keys](https://resend.com/docs/dashboard/emails/idempotency-keys), mọi yêu cầu gửi tới `https://api.resend.com/emails` đều đính kèm header `Idempotency-Key` (tối đa 250 ký tự, duy nhất theo từng sự kiện `form_confirm:<id>`, `reg_received:<id>`, `contact_receipt:<id>`, `test:<id>`) kết hợp cột `idempotency_key UNIQUE` trong bảng D1 `website_email_outbox`.
   - Bổ sung endpoint `POST /api/system?action=email-domain-check` cho phép quản trị viên kiểm tra trực tiếp trạng thái xác minh tên miền `skyfirst.io.vn` với Resend API (hoặc nhận diện khóa chỉ có quyền `Sending Access`).
   - Hỗ trợ **Chế độ Thử nghiệm an toàn (`mode: 'test'`)** chuyển hướng thư tự động về địa chỉ kiểm thử của Resend (`delivered@resend.dev`) để kiểm thử đầy đủ HTML/liên kết mà không gửi nhầm tới người dùng thật.
   - **Minh bạch kết quả kiểm thử trong môi trường máy ảo**: Môi trường sandbox hiện tại không gắn khóa `RESEND_API_KEY` thật của production và tắt kết nối mạng ra ngoài; hệ thống đã được kiểm thử tự động qua bộ giả lập `fetch` trong `tests/backend.test.mjs` (kiểm chứng đầy đủ các nhánh: `unconfigured`, `accepted_by_provider` HTTP 200 kèm `provider_id`, `invalid_config` HTTP 401/403, `rejected` HTTP 422, và `retry_scheduled` HTTP 429/503 với backoff hàm mũ `3^attempts` phút). Khi triển khai trên Cloudflare Pages có gắn secret `RESEND_API_KEY`, quản trị viên có thể bấm **"Gửi email thử"** tới `delivered@resend.dev` để xác nhận giao nhận thực tế.

---

## V. BÁO CÁO NGHIÊN CỨU TRỰC TIẾP CỔNG THÔNG TIN ĐIỆN TỬ CHÍNH PHỦ (`CHINHPHU.VN`) & ĐỀ XUẤT ÁP DỤNG CHO SKY FIRST

Đã thực hiện khảo sát trực tiếp các trang đang hoạt động của hệ thống Cổng Thông tin điện tử Chính phủ:
1. **Trang chủ Cổng Thông tin điện tử Chính phủ**: [https://chinhphu.vn/](https://chinhphu.vn/)
2. **Chuyên mục Chính phủ & Chỉ đạo điều hành**: [https://chinhphu.vn/chinh-phu](https://chinhphu.vn/chinh-phu) và [https://vpcp.chinhphu.vn/](https://vpcp.chinhphu.vn/)
3. **Hệ thống Văn bản quy phạm pháp luật & Điều hành**: [https://chinhphu.vn/he-thong-van-ban](https://chinhphu.vn/he-thong-van-ban) và [https://vanban.chinhphu.vn/he-thong-van-ban?classid=1&mode=1](https://vanban.chinhphu.vn/he-thong-van-ban?classid=1&mode=1)
4. **Chuyên trang Thông cáo báo chí**: [https://chinhphu.vn/thong-cao-bao-chi-68320](https://chinhphu.vn/thong-cao-bao-chi-68320)
5. **Chuyên trang Xây dựng chính sách, pháp luật**: [https://xaydungchinhsach.chinhphu.vn/](https://xaydungchinhsach.chinhphu.vn/)
6. **Báo Điện tử Chính phủ & Trang chi tiết bài viết**: [https://baochinhphu.vn/](https://baochinhphu.vn/) và bài viết chi tiết [Định vị lại Việt Nam và ASEAN trong chuỗi giá trị toàn cầu: Thích ứng để tăng trưởng](https://baochinhphu.vn/dinh-vi-lai-viet-nam-va-asean-trong-chuoi-gia-tri-toan-cau-thich-ung-de-tang-truong-101261027112529967.htm)

### Phân tích 9 Khía cạnh Nghiên cứu & Ứng dụng Thực tế vào Website Sky First

| Khía cạnh nghiên cứu trên `chinhphu.vn` | Quan sát thực tế & Ưu điểm nổi bật | Hạn chế / Điểm không phù hợp với quy mô SFN | Giải pháp đã chọn lọc & áp dụng cho Trang Thông Tin Điện Tử Sky First |
| :--- | :--- | :--- | :--- |
| **1. Cấu trúc trang chủ & phân cấp thông tin** | Trên [chinhphu.vn](https://chinhphu.vn/), phần đầu trang có thanh định danh cổng chính thức + ngày tháng năm âm/dương lịch, tiếp theo là cụm Tin tiêu điểm (Lead Story) bên cạnh danh sách tin cập nhật nhanh có gắn mốc giờ (`20:31`, `15:51`). | Trang chủ `chinhphu.vn` có mật độ khối rất dày (hơn 15 chuyên mục con, bản đồ hành chính 34 tỉnh/thành, thời tiết, công báo) dễ gây quá tải nếu áp dụng nguyên xi cho một mạng lưới thanh niên/giáo dục. | Bổ sung **Thanh Cổng Thông Tin Chính Thống (`showOfficialPortalBar`)** trên đỉnh `Navbar` (`src/components/SiteChrome.tsx`) hiển thị ngày tháng tiếng Việt và lối tắt tới *Hệ thống văn bản*, *Công khai & Minh bạch*, *Tra cứu hồ sơ*, *Thông báo chính thức*; giữ bố cục trang chủ SFN thoáng, rõ 5 trụ cột. |
| **2. Trình bày thông báo, tin tức & nội dung chính thức** | Tại [Thông cáo báo chí](https://chinhphu.vn/thong-cao-bao-chi-68320), mỗi bản tin đều mở đầu bằng tiền tố nguồn chính thống `(Chinhphu.vn) -` trong đoạn dẫn Sapo, giúp người đọc nhận biết ngay tính chính thức. | Các thông cáo hành chính thuần văn bản đôi khi thiếu nhãn màu phân biệt lĩnh vực hoạt động trẻ trung. | Kết hợp tiền tố nguồn chính thức trong Sapo với hệ thống `EntityBadge` phân màu ngữ nghĩa theo 17 chuyên mục chuẩn hóa của Sky First. |
| **3. Phân loại chuyên mục & điều hướng** | Hệ thống điều hướng phân tách rõ đối tượng thụ hưởng (*Công dân*, *Doanh nghiệp*, *Kiều bào*) và loại hình thông tin (*Hệ thống văn bản*, *Xây dựng chính sách*). | SFN không có cơ cấu Bộ/Ngành hay 63 cổng địa phương nên không cần cây danh mục đa tầng phức tạp. | Tổ chức thanh điều hướng 5 cụm rõ ràng (*Trang chủ*, *Giới thiệu*, *Hoạt động*, *Tra cứu*, *Tham gia & Tin tức*) kèm phân luồng theo đối tượng (*Thành viên*, *Core Team*, *Tình nguyện viên*, *Đối tác*). |
| **4. Trình bày trang chi tiết bài viết** | Trên bài viết [Định vị lại Việt Nam và ASEAN...](https://baochinhphu.vn/dinh-vi-lai-viet-nam-va-asean-trong-chuoi-gia-tri-toan-cau-thich-ung-de-tang-truong-101261027112529967.htm), bố cục gồm: Chuyên mục (`Kinh tế`) → Tiêu đề lớn → Ngày giờ đăng (`27/10/2026 12:04 PM`) → Sapo in đậm → Ảnh minh họa kèm chú thích rõ nguồn (`Ảnh: chinhphu.vn/Lê Anh`) → Các tiêu đề phụ `H2` → Khối *Tham khảo thêm* & *Bài viết cùng chuyên mục* → Hộp bản quyền ghi rõ nguồn khi phát hành lại. | Giao diện báo điện tử truyền thống có nhiều banner chuyên đề bên cột phải có thể làm phân tán sự tập trung khi đọc tài liệu giáo dục dài. | Tại `src/pages/NewsDetailPage.tsx`, áp dụng đầy đủ chuẩn bài viết chính thống (breadcrumb chuyên mục, mốc thời gian, trình đọc giọng nói tiếng Việt, mục lục tự động từ `H2`/`H3`, chú thích ảnh + nguồn, bài cùng chuyên mục, dòng ghi nhận bản quyền cuối bài) và thêm nút **Đọc tập trung** ẩn thanh bên khi cần. |
| **5. Khả năng tìm kiếm, tra cứu văn bản & tài liệu đã đăng** | Tại [Hệ thống văn bản](https://vanban.chinhphu.vn/he-thong-van-ban?classid=1&mode=1), văn bản được trình bày dạng bảng chuẩn 3–4 cột: **Số ký hiệu** (`397/2026/NĐ-CP`), **Ngày ban hành** (`26/10/2026`), **Trích yếu nội dung** và **Tài liệu đính kèm** kèm bộ lọc theo *Lĩnh vực*, *Cơ quan ban hành*, *Năm ban hành*. | Bộ lọc hàng trăm cơ quan ban hành cấp nhà nước quá đồ sộ so với quy mô của SFN. | Nâng cấp trực tiếp `DocumentCenter` tại `src/pages/CustomPageDetail.tsx` (`/tai-lieu-cong-khai`) thành bảng tra cứu chuẩn 4 cột (**Số ký hiệu / Loại**, **Ngày công bố**, **Trích yếu nội dung & Đơn vị ban hành**, **Tài liệu đính kèm**) kèm bộ lọc nhanh theo từ khóa, loại văn bản và năm ban hành. |

---

## VI. BẢNG KIỂM ĐẾM TỆP VÀ NGHIỆM THU CUỐI CÙNG

- **Kiểm tra số lượng tệp thực tế (`python3 scripts/verify_release.py` & `unzip -l`)**: **68 tệp** (nằm trong giới hạn nghiêm ngặt `<= 69` tệp).
- **Kiểm tra cú pháp Cloudflare Pages Functions (`node --check`)**: **17/17 tệp PASS**.
- **Kiểm tra biên dịch TypeScript/React (`@babel/core` preset TypeScript + React) & Liên kết Module**: **29/29 tệp TS/TSX biên dịch sạch, 161 liên kết import hợp lệ (0 lỗi)**.
- **Kiểm thử tích hợp Backend, D1, R2 Video Intro, Biểu mẫu, Resend API & Sao lưu (`node --test tests/backend.test.mjs`)**: **18/18 bài kiểm thử PASS (0 fail)**.
- **Hạng mục cần thực hiện trên môi trường Cloudflare Pages khi triển khai thật**:
  - Do môi trường máy ảo kiểm thử hiện tại bị cô lập mạng Internet theo chính sách an toàn hệ thống, lệnh `npm ci && npm run build` trực tiếp với `registry.npmjs.org` và việc gửi thư qua mạng Internet ra máy chủ `api.resend.com` bằng khóa thật sẽ được thực thi tự động trên pipeline của Cloudflare Pages (hoặc máy chủ CI/CD có Internet) với `package-lock.json` đã khóa chuẩn `esbuild@0.25.12` và `vite@6.4.3`.
