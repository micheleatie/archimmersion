# Archimmersion

The public site is temporarily a minimal holding page while a new Archimmersion experience is prepared. It is built with Eleventy and deploys to GitHub Pages from `main`.

## Local preview

```sh
npm install
npm run dev
```

Run `npm run build` before publishing. Generated files live in `_site/` and are not committed.

## Current live source

- `src/index.njk` — holding-page content
- `src/_includes/layouts/holding.njk` — minimal document shell
- `src/assets/css/holding.css` — holding-page styling
- `src/assets/img/favicon.svg` — architectural A favicon and Safari mask icon
- `src/_includes/wordmark-construction.njk` — inline animated wordmark used by
  the holding page
- `src/assets/img/wordmark-construction.svg` — standalone generated copy
- `scripts/generate_wordmark_svg.py` — generator for both wordmark copies

The page intentionally has no navigation, contact route, or service content.
Its title is revealed through varied architectural guide lines and continuous
Avenir Next contour drawing, with a reduced-motion fallback to the finished
wordmark. The live wordmark is inline so every page reload creates a fresh
animation timeline instead of reusing a completed external SVG image.

## Previous site

The former interactive site has not been deleted. Its complete source snapshot is in [`archive/site-v1/`](archive/site-v1/), outside Eleventy’s input directory. See its README for restoration steps.

Earlier wordmark options are preserved under
[`archive/holding-variants/`](archive/holding-variants/).

## Deployment

GitHub Actions builds and deploys the `_site/` directory through [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) when `main` is pushed.
