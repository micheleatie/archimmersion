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

The page intentionally has no navigation, contact route, or service content.

## Previous site

The former interactive site has not been deleted. Its complete source snapshot is in [`archive/site-v1/`](archive/site-v1/), outside Eleventy’s input directory. See its README for restoration steps.

## Deployment

GitHub Actions builds and deploys the `_site/` directory through [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) when `main` is pushed.
