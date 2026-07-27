# Archimmersion project memo

## Current state

As of 2026-07-27, the public Eleventy site is intentionally a single, static holding page: the Archimmersion title, a short under-construction message, and the studio email address. It has no navigation, JavaScript, imagery, or service pages.

## Working entry points

- Start locally with `npm run dev`.
- Verify production output with `npm run build`.
- Eleventy reads `src/` and writes `_site/`.
- GitHub Pages deployment is defined in `.github/workflows/deploy-pages.yml`; `_site/` is the uploaded artifact.

## Live source map

- `src/index.njk` contains the holding-page content.
- `src/_includes/layouts/holding.njk` provides the document shell.
- `src/assets/css/holding.css` contains all live presentation styles.
- `.eleventy.js` is intentionally minimal and copies only the active assets.

## Archived site

The former interactive Eleventy website is preserved, not deleted, at `archive/site-v1/`. Because that directory is outside `src/`, it cannot be included in a deployment by accident.

Use `archive/site-v1/README.md` as the restoration guide. Before restoring or reusing individual parts, build locally and review the generated output; the archived configuration, templates, and scripts belong together.

## Housekeeping

Keep this memo current-state-first. Put historical implementation detail in the relevant archive README rather than turning this file into a chronology.
