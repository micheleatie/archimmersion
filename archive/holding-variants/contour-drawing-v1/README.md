# Contour drawing v1

This is the first generated-vector construction option for the holding-page
wordmark, saved on 2026-07-27 before further motion refinements.

The saved SVG is self-contained. It uses the real Avenir Next Medium glyph
contours, draws each contour independently, fills the completed letters, and
settles the letters using horizontal movement only.

To restore it as the active asset:

```sh
cp archive/holding-variants/contour-drawing-v1/wordmark-construction.svg \
  src/assets/img/wordmark-construction.svg
```

Do not regenerate the saved file: the generator intentionally creates it only
when it does not already exist.
