# CODEX_MEMO

## Architecture Snapshot
- Eleventy v3 with Nunjucks templates.
- Input/output config: `src` -> `_site`.
- Base layout: `src/_includes/layouts/base.njk`.
- Homepage is bespoke template: `src/index.njk`.
- Section content is Markdown-first:
  - `src/design/index.md`
  - `src/representation/index.md`
  - `src/communication/index.md`

## Durable Conventions
- Section pages must include front matter keys:
  - `title`, `sectionKey`, `order`
  - optional `heroImage`, optional `links`
- Canonical section keys/slugs/anchors:
  - `design`, `representation`, `communication`
- Subpage titlebar links target homepage anchors:
  - `/#design`, `/#representation`, `/#communication`, `/#top`

## Assets and Behavior
- Shared CSS/JS served from `src/assets` -> `/assets`.
- Homepage interaction:
  - `src/assets/js/site.js` toggles `body.is-expanded` on scroll/click.
- Carousel enhancement:
  - `src/assets/js/carousel.js`
  - preferred source: `[data-carousel]` wrapped image list
  - fallback source: first image list under a `Gallery` heading
- No JS fallback remains readable (stacked images/text).

## Editing Workflow
- Client edits text/images in Markdown section pages.
- Client places media in page-local `img/` folders and references with `./img/...`.
