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

Most content updates can be done safely without touching code.

### 1) For most edits, use these 3 files

- `src/design/index.md`
- `src/representation/index.md`
- `src/communication/index.md`

If you only change text/images in these files, you are in the safe area.

### 1b) Homepage-only text that lives outside those files

Two extra files control global/homepage text:

- `src/index.njk`
  - editable for Contact section text at the bottom of homepage:
    - `Contact` heading
    - contact paragraph
    - email button label and email address (`mailto:...`)
- `src/_data/site.js`
  - editable global values:
    - `name` (used in page titles/footer)
    - `description` (default meta description)

For non-developers: in `src/index.njk`, only edit the visible words in the Contact section.  
Do not edit the hero letter spans, loops, or template tags (`{% ... %}`, `{{ ... }}`).

### 2) In each file, the very top block controls homepage content

At the top of each file, there is a block between `---` and `---`.  
You can edit text values there, but keep the structure.

Important fields:
- `title`: section title (also shown on homepage)
- `homeBlurb`: short text on homepage card
- `heroImage`: homepage card image path (usually `./img/cover.jpg`)
- `links`: clickable list shown on homepage card

Please do not change these unless asked:
- `layout`
- `sectionKey`
- `order`
- `permalink`

Important formatting rules for this top block:
- keep both `---` lines (start and end of the block)
- every line must be `key: value` format (no loose text lines)
- for long text, use either:
  - one quoted line, or
  - a multiline YAML block with `>` like this:

```yaml
homeBlurb: >
  First sentence of the blurb.
  Second sentence of the blurb.
```

- do not use tabs; use normal spaces
- if this formatting breaks, `npm run dev` / build will fail

### 3) Edit the main page text below that block

Everything below the second `---` is the actual page content.  
You can freely edit paragraphs, headings, and image captions there.

### 4) Creating link targets inside a page

If you want a homepage card link to jump to a specific place in a page, use:

```md
<anchor id="space-planning">Space planning</anchor>
```

Then point the related link to:

```text
/design/#space-planning
```

Tips:
- use lowercase ids
- use hyphens instead of spaces
- keep ids unique on the same page

### 5) Add images

Place images in the matching folder:
- `src/design/img/`
- `src/representation/img/`
- `src/communication/img/`

Use them in content like this:

```md
![Short caption](./img/example.jpg)
```

That caption text is also used as visible figure/carousel caption.

### 6) Gallery format

Use this format for image galleries:

```md
## Gallery

<div data-carousel>

- ![Caption 1](./img/01.jpg)
- ![Caption 2](./img/02.jpg)

</div>
```

At least 2 images are needed for carousel behavior.

### 7) What not to edit

Avoid editing these unless a developer asks:
- `.eleventy.js`
- files in `src/_includes/`
- files in `src/assets/js/`
- files in `src/assets/css/`

### 8) Quick troubleshooting (if local preview fails)

If `npm run dev` or `npm run build` suddenly fails after content edits, first check:
- front matter in the edited `.md` file (top `---` block) for broken formatting
- accidental deletion of `---`
- accidental plain text line inside front matter without `key:`
- malformed link/anchor lines in `links:`

## Progressive enhancement behavior

- Without JS: homepage sections/links still display, and gallery images remain stacked.
- With JS: homepage gets animated expand/collapse and galleries become interactive carousels.

## Publishing flow

Local preview:
- `npm install`
- `npm run dev`

Publish:
- Commit changes
- Push to `main`
- GitHub Actions deploys automatically

Notes:
- Do not commit `_site/` (generated output).
- Do not commit `node_modules/`.
