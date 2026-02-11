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
    - `--align-progress` (subtitle words to section-header X alignment)
  - Motion range is `max(150px, 18vh)` with staged timing:
    - spread first, then wordmark fade, then section reveal, then column offsets.
  - Current stage mapping:
    - `spread = stage / 0.22`
    - `reveal = (stage - 0.16) / 0.26`
    - `wordmarkFade = (stage - 0.1) / 0.22`
    - `align = (stage - 0.08) / 0.24`
- Landscape mode class is `home-landscape-motion`.
- Subtitle words on the homepage link directly to their own section pages.
- Landscape (`orientation: landscape` and `min-width:1000px`): subtitle words start clustered, spread quickly, then act as left-aligned section headings while sections fade in; section columns receive progressive vertical offsets after reveal.
- Landscape subtitle alignment details:
  - landscape subtitle uses centered flex layout at start (coherent grouped phrase);
  - JS computes per-word `--target-shift` from live geometry each scroll frame:
    - `baseWordLeft = subtitleRect.left + word.offsetLeft`
    - `cardLeft = gridRect.left + sectionCard.offsetLeft`
  - CSS applies `translateX(calc(var(--target-shift) * var(--align-progress)))`, giving exact final left alignment for all three headings even as subtitle spread changes.
  - subtitle-word transition is disabled to prevent lag/drift against scroll-driven JS updates.
  - visible section fade-in is accelerated via boosted opacity multipliers on `.sections-grid` and `.section-card`.
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
