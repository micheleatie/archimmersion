# Archimmersion project memo

## Current state

As of 2026-07-27, the public Eleventy site is intentionally a single holding
page: the Archimmersion title, an under-construction label, and the studio
email address. The wordmark uses a self-contained architectural drawing
animation generated from real Avenir Next Medium glyph geometry. Varied
overshooting drafting guides draw first; the true glyph contours then trace
continuously while the letters settle horizontally without vertical movement
or scaling. The page has no navigation, JavaScript, imagery, or service pages.

The guide generator uses letter-specific geometry where generic rules would be
visually misleading: each I has exactly two vertical guides aligned to its
outline edges; C, S, and O omit horizontal bound guides; C and S use two
extended terminal diagonals plus two continuous tangent-curve extensions; and
H, M, and N derive guides only from their real edges rather than a generic
vertical. O uses two true vertical tangent guides at its left and right bounds
rather than a fractional-position or center guide.

Guide strokes explicitly grow from zero to full length at constant opacity,
hold, and then fade. Letter fills and supporting copy begin only after that
construction phase is readable. Finished glyph outlines remain visible through
the entire fill transition and fade only after the matching filled shapes are
present, so the wordmark never returns to an empty intermediate state.
The slower contour drawing overlaps the start of the fill, and every outline
stroke is clipped to the exact compound glyph silhouette so its disappearance
cannot reveal a smaller final letter. During construction, the letters make a
subtle symmetric horizontal settle toward their final positions; there is no
vertical movement, rotation, or scaling. The settle spans the full construction
timeline, and all letters reach their exact final positions together as the
last outlines finish. Its linear pace keeps the convergence perceptible through
the late fill and outline-fade stages rather than resolving halfway through.

The live SVG is included directly in the page document. This is intentional:
an external SVG loaded through an `<img>` could be restored from the browser
cache at the end of its internal animation while the page-level copy animations
started again. Inline markup gives every navigation or reload a new animation
timeline, so the entire construction sequence always restarts together.

## Working entry points

- Start locally with `npm run dev`.
- Verify production output with `npm run build`.
- Eleventy reads `src/` and writes `_site/`.
- GitHub Pages deployment is defined in `.github/workflows/deploy-pages.yml`; `_site/` is the uploaded artifact.

## Live source map

- `src/index.njk` contains the holding-page content.
- `src/_includes/layouts/holding.njk` provides the document shell.
- `src/_includes/wordmark-construction.njk` is the inline live wordmark.
- `src/assets/css/holding.css` contains all live presentation styles.
- `src/assets/img/wordmark-construction.svg` is the standalone generated copy.
- `scripts/generate_wordmark_svg.py` regenerates both wordmark copies from the
  local system font without adding a browser or build-time dependency.
- `.eleventy.js` is intentionally minimal and copies only the active assets.

## Archived site

The former interactive Eleventy website is preserved, not deleted, at `archive/site-v1/`. Because that directory is outside `src/`, it cannot be included in a deployment by accident.

Use `archive/site-v1/README.md` as the restoration guide. Before restoring or reusing individual parts, build locally and review the generated output; the archived configuration, templates, and scripts belong together.

Earlier contour and segmented-construction wordmark options are separately
preserved under `archive/holding-variants/`. Regenerating the active asset does
not overwrite either option.

## Housekeeping

Keep this memo current-state-first. Put historical implementation detail in the relevant archive README rather than turning this file into a chronology.
