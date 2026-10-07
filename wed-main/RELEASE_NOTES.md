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
