# MIGRATION COMPATIBILITY

Prototype cũ từng dùng các bảng như `admins`, `certificates`, `content`, `forms`, `languages`, `media`, `menus`, `partners`, `portals`, `sessions`, `settings`, `units`.

Production V2 dùng `site_*` cho các nhóm có nguy cơ trùng tên và tạo các bảng nội dung riêng (`pages`, `posts`, `programs`, `classes`, `activities`, `team_members`, `albums`, `documents`, `issuer_api_keys`, `rate_limits`). Migration không DROP hoặc ALTER các bảng prototype cũ.

`tests/legacy-compat.mjs` dựng các bảng prototype trước, sau đó chạy toàn bộ migration V2 và xác nhận dữ liệu prototype vẫn còn nguyên.
