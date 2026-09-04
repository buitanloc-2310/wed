# Checklist nghiệm thu

## Đã kiểm tra bằng QA local
- [x] `/` trả 200, không redirect loop trong runtime test.
- [x] Cả 35 public CMS routes trả 200.
- [x] `/admin` trả 200 và mở First-run setup/login.
- [x] `/api/health` trả JSON `{ ok: true }`.
- [x] Logo chính nằm ở Header + Footer và file logo trùng hash nguồn chính thức.
- [x] Facebook `facebook.com/skyfirstnetwork` và Instagram `instagram.com/sfn.network.vn` được seed đúng.
- [x] 20 ngôn ngữ có trong D1; default/fallback có thể cấu hình.
- [x] Chuỗi UI đa ngôn ngữ có CMS và fallback.
- [x] SFEC và Nhà Hán Ngữ là hai đơn vị trực thuộc ngang cấp.
- [x] 4 cổng Sky First được seed và hiển thị bằng tên cổng.
- [x] Form public ghi D1 trong runtime test; các luồng Core Team/TNV/Người học/Hợp tác tách riêng.
- [x] RBAC Editor/Reviewer/Super Admin được kiểm tra ở API.
- [x] Scheduled publishing: bản tương lai bị ẩn, bản đến hạn hiển thị.
- [x] Upload + serve media R2 được kiểm tra bằng mock R2.
- [x] GCN không lộ dữ liệu nhạy cảm; issuer khác không finalize được GCN không thuộc mình.
- [x] `robots.txt` và `sitemap.xml` hoạt động.
- [x] Migration V2 không ghi đè các bảng prototype cũ trong compatibility test.
- [x] Không có `admin.skyfirst.io.vn` và không có acronym bị cấm trong dữ liệu public seed.

## Cần xác nhận sau deploy Cloudflare thật
- [ ] D1 migration remote hoàn tất trên database `wed`.
- [ ] R2 binding `MEDIA` hoạt động với bucket `wed` thật.
- [ ] Worker URL và `https://skyfirst.io.vn` đều trả website mới.
- [ ] `/admin` tạo/login SUPER ADMIN thật.
- [ ] Upload ảnh/PDF thật và mở qua `/media/*`.
- [ ] Mobile 360–430 px kiểm tra trực tiếp trên trình duyệt/thiết bị.
- [ ] Không có lỗi console/network trên production.

- [x] Deploy script áp dụng D1 remote migrations trước Worker deploy.
- [x] `/api/health/db` kiểm tra DB binding + các bảng lõi.
