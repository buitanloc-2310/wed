# CONTENT MODEL

Pages và Posts có `translation_group + lang`, lifecycle Nháp → Chờ duyệt → Đã xuất bản → Ẩn/Lưu trữ và hỗ trợ `scheduled_at`.

Các dữ liệu thay đổi thường xuyên nằm trong D1 và quản lý qua Admin: chương trình, lớp học, hoạt động, đơn vị, nhân sự công khai, đối tác, album, tài liệu, menu, cổng hệ thống, biểu mẫu, media, GCN và cài đặt.

Footer không hard-code danh sách liên kết chính: các nhóm `footer_quick`, `footer_join`, `footer_policy` dùng `site_menus`; cổng hệ thống dùng `site_portals`; thông tin liên hệ/social/SEO dùng `site_settings`.
