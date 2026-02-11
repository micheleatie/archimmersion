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
  - `src/assets/js/site.js` now uses a staged landscape-only motion model with 4 variables:
    - `--spread-progress` (keywords spread)
    - `--wordmark-fade` (wordmark disappearance)
    - `--reveal-progress` (section fade-in)
    - `--offset-progress` (post-reveal vertical offsets)
  - Motion range is short (`max(150px, 20vh)`) so heading spread and section reveal happen quickly.
  - Landscape mode class is `home-landscape-motion`.
  - Subtitle words on the homepage link directly to their own section pages.
- Landscape (`orientation: landscape` and `min-width:1000px`): subtitle words start clustered, spread quickly, then act as left-aligned section headings while sections fade in; section columns receive progressive vertical offsets after reveal.
- Portrait/narrow (`orientation: portrait` or `max-width:999px`): simplified static flow (no landscape motion transforms) to avoid duplication/overlap while landscape behavior is tuned.
- Carousel enhancement:
  - `src/assets/js/carousel.js`
  - preferred source: `[data-carousel]` wrapped image list
  - fallback source: first image list under a `Gallery` heading
  - auto-advances until first manual navigation; supports image click for next slide and hover/focus overlay arrows
- No JS fallback remains readable (stacked images/text).

## Editing Workflow
- Client edits text/images in Markdown section pages.
- Client places media in page-local `img/` folders and references with `./img/...`.
