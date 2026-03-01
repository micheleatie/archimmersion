# CODEX_MEMO

## Architecture Snapshot
- Eleventy v3 with Nunjucks templates.
- Input/output config: `src` -> `_site`.
- Base layout: `src/_includes/layouts/base.njk`.
- Homepage template: `src/index.njk`.
- Section content is Markdown-first:
  - `src/design/index.md`
  - `src/representation/index.md`
  - `src/communication/index.md`

## Durable Conventions
- Section pages use front matter keys: `title`, `sectionKey`, `order`, and optional `links`.
- Canonical section keys/slugs:
  - `design` -> `/design/`
  - `representation` -> `/representation/`
  - `communication` -> `/communication/`
- Subpage titlebar links route to each section page plus homepage.

## Homepage Model (2026-03-01)
- Homepage is now a two-stage flow:
  1. minimal hero with centered `ARCHIMMERSION` wordmark.
  2. interactive line-art architectural room scene revealed on scroll.
- Room instruction caption above SVG is now `Explore the room.` (centered, light weight, slightly larger than prior caption size).
- Scene is inline SVG (vector, black line-art on white) in `src/index.njk`.
- Required SVG group structure is present:
  - `g#room-background`
  - `g#hotspot-window` (Design)
  - `g#hotspot-laptop` (Communication)
  - `g#hotspot-model` (Representation)
- Each hotspot group includes:
  - `role="button"`
  - `tabindex="0"`
  - `aria-label` for action text
  - `aria-controls="pillar-panel"`
  - per-hotspot panel content via `data-panel-*` attributes.
- Communication hotspot laptop uses a straight, open silhouette with explicit screen + base geometry.
- Representation hotspot object is a small house-like physical model silhouette.
- Laptop/model hitboxes were adjusted to avoid overlap and improve reliable click selection of Communication.

## Communication Page Model (2026-03-01)
- `src/communication/index.md` now sets `bodyClass: communication-page` for page-specific styling.
- Communication subpage uses pure white presentation (sunrays background disabled only on this page).
- Communication text is intentionally compact:
  - smaller typography than default subpages
  - content block width constrained to roughly half-page on desktop.
- Added interactive street-to-360 block:
  - square black-and-white wireframe top-view map (`src/communication/img/street-map-wireframe.svg`)
  - map has one exterior pin only (street -> exterior 360)
  - exterior 360 example (`src/communication/img/panorama-360-example.svg`)
  - interior 360 example (`src/communication/img/panorama-360-interior-example.svg`)
  - interior reveal is triggered by a second pin placed on a building inside the exterior 360 (`.comm-panorama-pin`)
  - interior reveal includes adjacent explanatory text block (`.comm-interior-text`)
  - fisheye view removed from page and assets
  - map and panorama SVGs were densified with richer wireframe detail to make scroll/navigation obvious
  - panorama viewport intentionally small; navigation uses mouse-wheel horizontal scroll + pointer drag via `src/assets/js/site.js`.
  - reveal action hardened:
    - map spot now handles click + pointerup + keyboard Enter/Space
    - CSS fallback enabled via `:target` so reveal works even without JS
    - JS also adds `.is-visible` class when active
    - when interior target is selected, JS reveals both exterior and interior windows side-by-side
    - hashchange listener keeps reveal state aligned with URL hash navigation
    - map spot has explicit z-index/pointer-events for reliable tapping.
  - panorama navigation tuning:
    - wheel horizontal scroll accelerated (`deltaY * 2.4`)
    - drag-to-scroll accelerated (delta multiplied by `1.7`)
    - panorama render widths reduced (desktop/mobile) so key content appears sooner.

## Homepage Interaction Logic
- Implemented in `src/assets/js/site.js`.
- Uses `IntersectionObserver` to reveal the room section when scrolled into view.
- Single click (or keyboard Enter/Space) on a hotspot opens panel immediately.
- Panel system:
  - reusable dialog panel (`#pillar-panel`)
  - right-side slide-in on desktop
  - bottom sheet on mobile
  - no extra kicker label above panel title
  - ESC closes panel
  - backdrop click closes panel
  - clicking another hotspot switches panel content in place.
- Panel CTA link also has JS `window.location.assign(...)` fallback to ensure navigation fires reliably when clicked.
- Focus behavior: when panel closes, focus returns to last active hotspot.

## Styling Notes
- Global stylesheet: `src/assets/css/site.css`.
- Homepage has dedicated override block:
  - enforced white background + black text/lines
  - sunrays pseudo-background disabled on homepage only
  - hotspot hover/focus/active state uses subtle stroke-weight increase
  - panel and backdrop transitions are lightweight CSS transitions.
- Mobile refinements:
  - hero height reduced for faster access to the room section.
  - room SVG gets minimum render height to keep hotspots readable on phones.
  - hotspot interaction uses `touch-action: manipulation` and larger stroke presence.
  - panel bottom sheet height increased for better content legibility.
- Subpage styles and carousel remain in the same stylesheet.

## Editing Workflow
- Client-safe text/media edits remain in:
  - `src/design/index.md`
  - `src/representation/index.md`
  - `src/communication/index.md`
- Homepage interactive pillar copy and CTA targets are currently authored directly in hotspot `data-panel-*` attributes inside `src/index.njk`.
- Homepage contact button currently uses fixed recipient `mailto:atiemichele@gmail.com`.
- In Markdown pages using raw HTML tags (`<img ...>`), image paths should use:
  - `{{ './img/file.svg' | resolvePageAsset(page.url) | toBaseRelative }}`
  - this avoids broken asset URLs under the runtime `<base>` behavior.
- With runtime `<base>` enabled, fragment links in subpages should include the page path:
  - use `{{ '/communication/#some-id' | toBaseRelative }}` instead of `href="#some-id"`.

## Deployment Notes
- Repository remote: `client` -> `git@github.com:micheleatie/archimmersion.git`.
- Primary working branch: `main`.
- `_site/` is generated output and should not be committed.
- GitHub Pages workflow file: `.github/workflows/deploy-pages.yml`.
