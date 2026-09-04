# PRIVACY

- Public visibility là explicit; tồn tại trong D1 không đồng nghĩa được phép công khai.
- Team members và partners mặc định non-public trong schema.
- Form public tách theo mục đích, có consent, rate-limit và honeypot; không yêu cầu giấy tờ định danh trong bước liên hệ ban đầu.
- EDITOR không được đọc dữ liệu biểu mẫu chứa email/điện thoại; REVIEWER/ADMIN/SUPER ADMIN mới xử lý theo quyền.
- R2 object không yêu cầu public bucket URL; Worker kiểm tra `site_media.public` trước khi trả file.
- Public GCN lookup không trả dữ liệu liên hệ hoặc quản trị.
