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
  - Motion range is `max(150px, 18vh)` with staged timing:
    - spread first, then wordmark fade, then section reveal, then column offsets.
  - Current stage mapping:
    - `spread = stage / 0.22`
    - `reveal = (stage - 0.16) / 0.26`
    - `wordmarkFade = (stage - 0.1) / 0.22`
- Landscape mode class is `home-landscape-motion`.
- Subtitle words on the homepage link directly to their own section pages.
- Landscape (`orientation: landscape` and `min-width:1000px`): subtitle words start clustered, spread quickly, then act as left-aligned section headings while sections fade in; section columns receive progressive vertical offsets after reveal.
- Landscape subtitle alignment details:
  - dynamic per-word alignment model is active:
    - JS computes each word's X delta to its corresponding `.section-card` left edge.
    - CSS applies `translateX(calc(var(--target-shift) * var(--align-progress)))`.
  - start state uses centered subtitle phrase; end state aligns words to section column headers.
  - section header words now follow the same vertical column offsets as cards:
    - column 2 and 3 use shared offset vars multiplied by `--offset-progress`.
  - visible section fade-in is accelerated via boosted opacity multipliers on `.sections-grid` and `.section-card`.
- Homepage includes a full-width `Contact` section below the three columns:
  - heading, short text, and `mailto:` button; content is center-aligned.
- Primary visual spacing/motion tuning lives in `src/assets/css/site.css` `:root`:
  - `--landscape-col-offset-2`, `--landscape-col-offset-3`
  - `--landscape-subtitle-rise`
  - `--home-contact-top-space`, `--home-contact-bottom-space`
  - `--home-footer-gap`
  - `--landscape-hero-min-start`, `--landscape-hero-min-end` (top-state centering and collapse depth)
  - `--landscape-hero-top-pad-start/end`, `--landscape-hero-bottom-pad-start/end`
  - `--landscape-subtitle-wordmark-gap-base/spread/reveal` (wordmark-to-keyword spacing)
  - `--landscape-sections-lift-max` (how much section content rises toward headers during mid-transition)
  - `--home-main-min-height`, `--home-main-bottom-space`, `--home-scroll-runway-space`
    - these control the large blank area between the contact block and footer on homepage.
- Wordmark stability:
  - `.hero-wordmark` uses `font-size: 0` + `.wordmark-piece` `font-size: var(--wordmark-size)` to eliminate whitespace text-node flex wrapping;
  - wordmark is forced single-line with `flex-wrap: nowrap` and `white-space: nowrap`.
- Portrait/narrow (`orientation: portrait` or `max-width:999px`): simplified static flow (no landscape motion transforms) to avoid duplication/overlap while landscape behavior is tuned.
- Carousel enhancement:
  - `src/assets/js/carousel.js`
  - preferred source: `[data-carousel]` wrapped image list
  - fallback source: first image list under a `Gallery` heading
  - auto-advances until first manual navigation; supports image click for next slide and hover/focus overlay arrows
- No JS fallback remains readable (stacked images/text).
- Markdown authoring supports custom section anchor tags on subpages:
  - `<anchor id="space-planning">Space planning</anchor>`
  - empty form `<anchor id="space-planning"></anchor>` auto-generates title from id.
  - rendered output is `<h2 class="md-anchor" id="..."><a href="#...">...</a></h2>`.
  - implemented via markdown-it core preprocess in `.eleventy.js`.

## Editing Workflow
- Client edits text/images in Markdown section pages.
- Client places media in page-local `img/` folders and references with `./img/...`.
- Front matter pitfall:
  - multiline text must stay valid YAML; for long values use quoted strings or block scalars (`>`).
  - plain unkeyed text inside front matter breaks build with `TemplateContentFrontMatterError`.

## Deployment Notes
- Repository currently tracks remote `client` -> `git@github.com:micheleatie/archimmersion.git`.
- Local/default working branch is `main`, tracking `client/main`.
- `_site/` is build output and is intentionally git-ignored; do not commit generated HTML.
- Preferred hosting path:
  - GitHub Pages via GitHub Actions (build Eleventy from source).
  - Workflow file committed at `.github/workflows/deploy-pages.yml`.
  - Custom domain on Pages: `www.archimmersion.fr`.
  - URL compatibility fix in templates:
    - runtime `<base>` is set to `/archimmersion/` only when host/path match GitHub preview (`micheleatie.github.io` + `/archimmersion/...`), otherwise `/`.
    - templates now emit base-relative URLs (no leading `/`) so preview and custom-domain root both resolve assets/routes.
  - DNS at Squarespace:
    - `CNAME` `www` -> `micheleatie.github.io`
    - `A` records for apex `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
