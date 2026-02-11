# Archimmersion Website (Eleventy)

Small informational website built with Eleventy and Markdown-first content editing.

## Run locally

- `npm install`
- `npm run dev`
- `npm run build`

## Project structure

- `src/index.njk`: bespoke homepage (wordmark hero + animated section reveal)
- `src/design/index.md`: Design section content
- `src/representation/index.md`: Representation section content
- `src/communication/index.md`: Communication section content
- `src/_includes/layouts/base.njk`: shared base layout and subpage titlebar
- `src/assets/css/site.css`: global styling (homepage states, titlebar, carousel)
- `src/assets/js/site.js`: homepage scroll/click expansion behavior
- `src/assets/js/carousel.js`: progressive enhancement gallery carousel

## Client editing guide

### 1) Edit subpage text in Markdown

Update body text directly in:

- `src/design/index.md`
- `src/representation/index.md`
- `src/communication/index.md`

### 2) Edit homepage section cards via front matter

Each section page controls homepage card content with front matter keys:

- `title` (required)
- `sectionKey` (required: `design`, `representation`, `communication`)
- `order` (required ordering)
- `heroImage` (optional image path, usually `./img/cover.svg` or `./img/cover.jpg`)
- `links` (optional list of `{ label, url }`)

### 3) Gallery authoring

Preferred format:

```md
## Gallery

<div data-carousel>

- ![Caption 1](./img/01.jpg)
- ![Caption 2](./img/02.jpg)
- ![Caption 3](./img/03.jpg)

</div>
```

Fallback also supported:

- Under `## Gallery`, a plain Markdown image list (without `<div data-carousel>`) is auto-detected by JS.

### 4) Add images

- Put image files in the local `img/` folder beside the section page, for example:
- `src/design/img/`
- `src/representation/img/`
- `src/communication/img/`
- Reference with relative paths, for example: `![Caption](./img/name.jpg)`

## Progressive enhancement behavior

- Without JS: homepage sections/links still display, and gallery images remain stacked.
- With JS: homepage gets animated expand/collapse and galleries become interactive carousels.
