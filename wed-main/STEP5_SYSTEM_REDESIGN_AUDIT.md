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
