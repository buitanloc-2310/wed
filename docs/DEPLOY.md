# First deployment

1. Push this folder’s contents to the `main` branch of the GitHub repository.
2. In GitHub Actions secrets, create `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The workflow uses them only during deployment.
3. In Cloudflare Worker `wed`, add a secret named `SETUP_KEY` with a long unique value. Do not place this value in GitHub or source files.
4. Run the GitHub action. It applies the two D1 migrations first, then deploys the Worker.
5. Add `skyfirst.io.vn/*` as a custom domain/route to Worker `wed` in Cloudflare.
6. Open `/quan-tri/khoi-tao` once and create the first owner account with the same `SETUP_KEY`. Then sign in at `/quan-tri/dang-nhap`.

## After deployment

Use `/quan-tri` to update the logo/favicon, visual tokens, footer and contact information. Uploading a new image sends it to R2 and switches the corresponding public setting immediately. Enter verified banking details and set `donation_verified` to `1` only when the account is ready for public publication.

## Verification API for approved Sky First systems

Each connected system receives an issuer key stored in `sky_issuer_keys`. It posts to `POST /api/issuer/certificates` with `x-sky-issuer-key`; the issuer label is determined by the server. Never expose issuer keys in browser JavaScript.
