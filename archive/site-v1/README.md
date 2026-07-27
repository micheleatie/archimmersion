# Archived Archimmersion site (v1)

This directory is a source snapshot of the previous Eleventy website, archived on 2026-07-27 while the public site is reduced to a holding page.

It is deliberately outside `src/`, so Eleventy cannot publish it accidentally. The snapshot retains the prior homepage, the three service pages, layouts, scripts, styles, assets, Eleventy configuration, and the separate line-art preview.

## Restore the previous site

1. Copy the contents of `archive/site-v1/src/` back into `src/`.
2. Restore `archive/site-v1/.eleventy.js` to the repository root.
3. Restore `archive/site-v1/preview/index.html` and `illustration.svg` only if that standalone preview is wanted again.
4. Run `npm run build` and inspect the generated `_site/` output before publishing.

The temporary holding-page source should be kept only if it remains useful as a fallback.
