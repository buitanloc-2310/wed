# SKY FIRST NETWORK — architecture

One Worker named `wed` serves all public routes and administration routes. It uses one D1 binding (`DB`) and one R2 binding (`MEDIA`). The public website never uses a separate static home page, a second preview, hash navigation, or duplicate source.

| Layer | Responsibility |
|---|---|
| `src/worker.js` | single entry point and static/media routing |
| `src/routes/public.js` | canonical public routes |
| `src/routes/api.js` | form intake, verification issuer API and health endpoint |
| `src/routes/admin.js` | protected editorial settings and upload controls |
| `src/views/` | reusable public and administrative presentation |
| `src/data/` | all D1 access helpers |
| `migrations/` | independent durable schema and official content seed |

The `sky_` table prefix intentionally avoids collision with any previous database tables. Public issuer names are derived from `sky_issuer_keys`, never supplied by the calling website.

## Public routes

`/home`, `/gioi-thieu`, `/hoat-dong`, `/don-vi`, `/tham-gia`, `/hop-tac`, `/tin-tuc`, `/thu-vien`, `/he-thong`, `/tra-cuu`, `/tai-tro-dong-hanh`, `/lien-he`, `/noi-dung` and `/noi-dung/:slug` are real server routes. Add `?lang=en` for English.

## Editorial policy encoded in the product

- No unapproved posts are public (`status='published'` only).
- The image library deliberately has no pretend activity images.
- Donation account data and its VietQR image render only when `donation_verified=1` and the required fields are completed.
- Certificate lookup returns only explicitly published statuses.
