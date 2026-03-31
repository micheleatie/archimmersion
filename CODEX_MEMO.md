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
- User-facing section label for `design` is now `Lighting` (URL remains `/design/`).
- Subpage titlebar headnote now lists only:
  - `Captation and Restitution` (`/representation/`)
  - `Communication` (`/communication/`)
  - plus the `Archimmersion` home wordmark link.

## Homepage Model (2026-03-01)
- Homepage is now a two-stage flow:
  1. minimal hero with centered `ARCHIMMERSION` wordmark.
  2. interactive line-art architectural room scene revealed on scroll.
- Room instruction caption above SVG is now `Explore the room.` (centered, larger, black, bold).
- `Explore the room.` caption is explicitly forced to pure black in CSS.
- Homepage EN/FR switch is positioned below the interactive room sketch (`.home-lang-switch--room`) and centered.
- Scene is inline SVG (vector, black line-art on white) in `src/index.njk`.
- Homepage room drawing source is now `src/assets/img/for-archimmersion.svg`, placed as the `#room-background` layer inside the home inline SVG (viewBox `1536 1024`).
- As of 2026-03-06, `src/assets/img/for-archimmersion.svg` was refreshed from client file `Desktop/archimmersion2.svg` (only SVG source swapped; scene structure and hotspots unchanged).
- `src/assets/img/room-sketch-test-pdf.png` and `src/assets/img/room-autotrace-clean.svg` remain as legacy references but are no longer active homepage backgrounds.
- Home now has 2 interactive hotspots:
  - `g#hotspot-caption`: Captation and Restitution (camera + poster click target),
  - `g#hotspot-laptop`: Communication (PC click target).
- Room background was updated to an open, frameless perspective (no closed perimeter box), keeping a more limitless spatial feel.
- Required SVG group structure is present:
  - `g#room-background`
  - `g#hotspot-caption` (Captation and Restitution)
  - `g#hotspot-laptop` (Communication)
- Each hotspot group includes:
  - `role="button"`
  - `tabindex="0"`
  - `aria-label` for action text
  - `aria-controls="pillar-panel"`
  - per-hotspot panel content via `data-panel-*` attributes.
  - inline tooltip label node (`[data-tooltip-text]`) shown on hover/focus before click.
- Communication hotspot laptop uses a straight, open silhouette with explicit screen + base geometry.
- Captation/Restitution hotspot combines camera + wall poster into a single trigger target.
- Home panel content now supports both formats:
  - bullet mode via `data-panel-points`
  - paragraph mode via `data-panel-body` (used by Communication and Captation/Restitution summary copy).
- Communication panel body formatting:
  - first two sentences are rendered as a bold lead (`<strong>`)
  - a blank line is inserted before the remaining paragraph text.
  - lead line now supports explicit line breaks (`\n`) to force split lines (used between `magazines.` and `Beyond...`).
- Home language translation coverage includes:
  - room instruction line
  - contact title/text/button
  - panel titles/content/CTA labels
  - hotspot aria-labels for each language.
- Home language choice is now persisted in `localStorage` key `arch_home_lang` and reused by subpages.
- Captation/Communication hit zones are now separated for reliable click selection.
- Homepage typography alignment:
  - `Explore the room.` is larger, black, and bold.
  - Home contact typography is aligned to the same title-family style (`Avenir Next` stack) with stronger tracking/weight for heading and CTA.
- Homepage contact now includes a subtle location line under the email CTA: `Paris, France`.
- Room reveal pacing is intentionally delayed:
  - increased vertical runway before room section (`.room-stage` top margin),
  - stricter IntersectionObserver trigger (`threshold: 0.52`, `rootMargin: 0 0 -18% 0`, plus minimum scroll gate).
- Reveal reliability fix:
  - room reveal now checks both IntersectionObserver state and live scroll/resize events.
  - this avoids a deadlock where the room stayed hidden if intersection happened before the minimum scroll gate was reached.
- Hotspot reveal animation now uses a stronger staged entrance style:
  - each object appears sequentially with soft blur-to-sharp + upward settle (`room-hotspot-enter`),
  - pointer events stay disabled until reveal is active.
- Hover/focus discoverability now includes small in-SVG tooltip pills (EN/FR localized) for:
  - Captation and Restitution
  - Communication.
- Homepage hotspot interaction color state:
  - default remains neutral line-art,
  - hover/focus/active now switches hotspot overlays + tooltip accents to blue.
- Homepage hotspots use vector object-trace hitlines (`.hotspot-hitline`) so clicks target object regions instead of broad section rectangles.
- Click-only visual reveal behavior was removed on home hotspots to avoid extra line artifacts around objects.
- Temporary mask overlays were removed to avoid visible gray artifacts near objects.
- Home hotspot feedback now relies on tooltip/state styling and panel opening only (no extra drawn reveal overlays).
- Captation hotspot wording is normalized as "Captation and Restitution" (ARIA label, panel title, CTA label, EN/FR tooltip text).
- Captation hotspot now has two tooltip positions (poster area + camera area), both synchronized by i18n updates.
- Communication hit-area around PC was expanded (`hotspot-laptop` invisible hit rect) so hover/click can trigger from all around the object.
- Communication hotspot also uses `pointer-events: bounding-box` when visible to keep hover activation reliable across the full PC envelope.
- Manual wall overlay (`#room-wall-lines`) was removed because it introduced visible double/overlapping wall lines against the source SVG.

## Communication Page Model (2026-03-01)
- `src/communication/index.md` now sets `bodyClass: communication-page` for page-specific styling.
- Communication subpage uses pure white presentation (sunrays background disabled only on this page).
- Communication text is intentionally compact:
  - smaller typography than default subpages
  - content block width constrained to roughly half-page on desktop.
- Communication content now supports EN/FR dynamic translation via `data-comm-i18n` / `data-comm-i18n-aria` attributes, driven by the stored home language.
- The duplicate line `Ideal for` under the `#ideal-for` anchor heading was removed (single heading remains).
- Panorama alignment stabilization:
  - fixed caption min-height on desktop keeps exterior/interior windows aligned even with longer French strings.
  - anchor-click reveal now prevents default jump and updates hash with `history.replaceState(...)` to avoid visual displacement.
- Home panel CTA usability:
  - panel layout keeps close button + scrollable content, and CTA now sits directly under each section summary/list inside `.pillar-panel-content` (higher placement).
  - CTA click is handled with explicit URL resolution against `document.baseURI` before `window.location.assign(...)` to avoid FR/EN navigation breakage.
- Communication narrative copy now mirrors client-approved phrasing for:
  - `Immersive Storytelling for Architecture`
  - `What Makes Us Different`
  - `Ideal for`.
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
    - cross-browser hardening:
      - panorama/map `<img>` nodes are marked `draggable="false"` to avoid Chrome image-drag conflicts
      - panorama drag logic ignores interactive descendants like the interior pin, preventing Safari click interception
      - scroller uses `touch-action: pan-x pinch-zoom`, `overscroll-behavior-x: contain`, and `-webkit-overflow-scrolling: touch`
  - panorama render widths reduced (desktop/mobile) so key content appears sooner.

## Representation Page Model (2026-03-01)
- `src/representation/index.md` now sets `bodyClass: representation-page`.
- Representation page title is now `Captation and Restitution` (URL remains `/representation/`).
- Representation now uses the same pure-white visual language as Communication:
  - no sunrays overlays
  - white topbar/background
  - compact text widths and typography.
- All figure/media blocks were removed from the Representation page content (`<figure>` / map/model interactive block removed).
- In Representation services copy, the standalone `We analyze` subsection was removed and its items were merged in parentheses into `Atmosphere-sensitive information`.

## Lighting Page Model (2026-03-01)
- `src/design/index.md` now sets `bodyClass: lighting-page`.
- Lighting uses pure-white presentation (same neutral style family as Communication/Representation):
  - no sunrays overlays
  - white topbar/background
  - compact text widths and typography.

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
- Panel CTA link uses robust JS navigation (`new URL(href, document.baseURI)` + `window.location.assign(...)`) for reliable routing in both EN/FR.
- Focus behavior: when panel closes, focus returns to last active hotspot.
- Non-home interactive experiences are now initialized generically from `src/assets/js/site.js` via:
  - `[data-comm-experience]` and `[data-repr-experience]` containers
  - shared spot/stack reveal attributes (`data-map-spot`, `data-panorama-stack`, `data-panorama-scroll`).

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
- All detailed section pages (non-home) now include a shared bottom CTA button via `src/_includes/layouts/base.njk`:
  - label: `Start a project`
  - action: `mailto:michele.atie@archimmersion.fr`
  - style: black rectangular button (`.section-project-cta`).
- Homepage interactive pillar copy and CTA targets are currently authored directly in hotspot `data-panel-*` attributes inside `src/index.njk`.
- Homepage contact button currently uses fixed recipient `mailto:michele.atie@archimmersion.fr`.
- In Markdown pages using raw HTML tags (`<img ...>`), image paths should use:
  - `{{ './img/file.svg' | resolvePageAsset(page.url) | toBaseRelative }}`
  - this avoids broken asset URLs under the runtime `<base>` behavior.
- With runtime `<base>` enabled, fragment links in subpages should include the page path:
  - use `{{ '/communication/#some-id' | toBaseRelative }}` instead of `href="#some-id"`.
- After editing Nunjucks/Markdown source, run `npm run build` (or `npm run dev`) to refresh `_site/`; local previews can otherwise keep serving stale generated HTML.

## Deployment Notes
- Repository remote: `client` -> `git@github.com:micheleatie/archimmersion.git`.
- Primary working branch: `main`.
- `_site/` is generated output and should not be committed.
- GitHub Pages workflow file: `.github/workflows/deploy-pages.yml`.
