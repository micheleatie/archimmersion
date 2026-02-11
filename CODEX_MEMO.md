# CODEX_MEMO

## Project Snapshot
- Repository was initially empty.
- Goal: bootstrap a basic informational company website using Eleventy.
- Current stack: Eleventy with Nunjucks templates and static CSS passthrough.

## Current Structure
- `src/_includes/layouts/base.njk`: shared layout with header/nav/footer.
- `src/_data/site.js`: global site/company metadata and nav links.
- `src/index.njk`, `src/about.njk`, `src/contact.njk`: starter pages.
- `src/css/site.css`: base styling and responsive layout.
- `.eleventy.js`: input/output dirs and CSS passthrough config.
- `package.json`: scripts for `dev`, `build`, `start`, `clean`.

## Operational Notes
- This environment cannot reach `registry.npmjs.org` right now, so package install was not possible here.
- To run locally with internet:
  - `npm install`
  - `npm run dev`

## Keep/Prune Guidance
- Keep only durable project decisions and structure notes here.
- Remove temporary troubleshooting details once no longer relevant.
