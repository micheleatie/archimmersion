# Holding-page architectural animation QA

## Evidence

- Architectural references:
  - `codex-clipboard-a46b6a34-3d9b-478c-a7f2-19777370d4ce.png`
  - `codex-clipboard-4b176efc-1212-440b-8cdf-4c4288a87f5b.png`
- Local implementation: `http://localhost:8084/`
- Desktop sequence: `output/design-qa/sequence-v12-continuity.png`
- C and S guide close-up: `output/design-qa/guides-v7-curves-closeup.png`
- Reference comparison:
  `output/design-qa/architectural-reference-comparison.png`
- Mobile drawing state: `output/design-qa/sequence-v12-mobile-mid.png`
- Mobile final state: `output/design-qa/sequence-v12-mobile-final.png`
- Third consecutive reload at 650 ms:
  `output/design-qa/reload-third-load-650ms.png`
- Optimized drawing sequence:
  `output/design-qa/safari-optimized-sequence.png`
- Desktop viewport: 1440 × 900 CSS pixels
- Mobile viewport: 320 × 568 CSS pixels

The source images are motion-language references rather than a literal
Archimmersion wordmark: they establish extended construction geometry,
continuous curves, and guide lines that remain visible while the final forms
appear. The user-selected motion layer adds restrained horizontal convergence.
The revised local sequence was captured during guide drawing, completed
outlines, filling, and the settled state.

## Findings

No actionable P0, P1, or P2 differences remain.

- Guide drawing: each guide animates `stroke-dasharray` from zero visible
  length to its full normalized path length at constant opacity. Guides are
  more widely staggered, hold after completing, and only then fade. Fills wait
  until the guide-growth phase has completed.
- I geometry: both I glyphs have exactly two vertical guides, placed directly
  on the two outline edges. The generic center vertical and extended-edge
  candidates are suppressed for I.
- C and S geometry: both letters have zero vertical guides, two real terminal
  diagonals, and two curved terminal continuations. The curved guides are exact
  extrapolations of the quadratic glyph segments adjacent to the terminal
  edges; they draw from their extended endpoint back into the true curve.
- Bound guides: C, S, and O have zero horizontal bound guides.
- O geometry: its two vertical guides sit on the exact left and right tangent
  bounds of the outer curve. There is no arbitrary fractional-position or
  center guide.
- H, M, and N geometry: the generic fractional-position vertical is suppressed.
  Their remaining guide lines are extensions of real glyph edges, so vertical
  strokes and diagonals stay aligned with the letterforms.
- Other architectural guides: pale horizontal, vertical, and diagonal guides
  derive from the actual glyph bounds and longest straight edges. Their
  extensions are deterministically varied by letter, so they end at visibly
  different distances rather than forming a perfect grid.
- Continuous contours: every real font contour is one dash-drawn path. The C
  and S each trace as uninterrupted Bézier contours rather than collections of
  short animated pieces.
- Motion: the letters begin with small, symmetric horizontal offsets and settle
  inward to their final positions. The maximum offset is about 0.7% of the
  wordmark width. The settle lasts through the full 3.26-second construction
  sequence, and every letter reaches its exact final position together at the
  end. A linear pace keeps subtle horizontal convergence active through the
  late fill and outline-fade stages; there is no vertical movement, rotation,
  or scaling.
- Outline-to-fill continuity: completed contour traces hold at full visibility
  while the exact compound glyph fills arrive underneath. Contour drawing is
  deliberately slower, while fills now begin earlier during the active contour
  drawing phase. This removes the visually inactive pause without turning the
  fill into an abrupt wipe. Outline fading begins only after the fills are
  present.
- Silhouette continuity: outline strokes are clipped inside the exact compound
  glyph shapes. Their centered stroke width therefore cannot extend past the
  final fill or reveal a smaller silhouette while fading.
- Typography and final state: the animated outlines and final filled letters
  use the same Avenir Next Medium geometry. The settled composition retains the
  existing size, color, under-construction label, and email treatment; the
  stylistically redundant secondary tagline is omitted.
- Responsiveness: at 320 pixels wide, the wordmark center measured 159.996
  pixels against a 160-pixel viewport center. `scrollWidth` and `clientWidth`
  were both 320 pixels.
- Accessibility: the heading keeps the accessible name `Archimmersion`; the
  visual SVG is decorative. `prefers-reduced-motion` presents the filled
  wordmark immediately and suppresses every guide and outline animation.
- Runtime: the SVG loaded completely. Browser logs contained no errors or
  warnings.
- Reload behavior: the wordmark is inline in the page rather than an external
  cached image. At 650 ms, the initial load and three consecutive desktop
  reloads each had 0 of 13 fills complete, all 62 guides visible, all 17
  contours visible, and the supporting copy hidden. Two consecutive 320-pixel
  reloads produced the same construction state. The final state still had all
  13 fills complete and no visible guides or contours.
- Rendering cost: all 62 guides now use one fixed normalized dash pattern and
  animate only its offset. This preserves the same draw, hold, and fade states
  without recalculating dash geometry on every frame. Paint containment limits
  invalidation to the wordmark. Desktop Safari control was unavailable in this
  Codex session, so the Safari-specific improvement requires confirmation on
  the reporting Mac; the optimized desktop and mobile sequences were visually
  verified with no browser errors or overflow.

## Preserved options

- `archive/holding-variants/contour-drawing-v1/`
- `archive/holding-variants/segmented-construction-v2/`

The generator creates each fallback only if it does not already exist, so the
active architectural version cannot overwrite them.

## Implementation checklist

- [x] Replace piece assembly with architectural drafting motion.
- [x] Give construction lines varied overshoot lengths.
- [x] Make guides visibly draw before they fade.
- [x] Align exactly two vertical guides to each I.
- [x] Remove vertical guides from C and S.
- [x] Remove horizontal bound guides from C, S, and O.
- [x] Define O's left and right tangent bounds with vertical guides.
- [x] Remove generic misplaced verticals from H, M, and N.
- [x] Give C and S two terminal diagonals apiece.
- [x] Extend two true curved guides from both C and S.
- [x] Trace the true glyph outlines instead of wiping finished outlines.
- [x] Keep C and S as continuous curves.
- [x] Restore the subtle symmetric horizontal typesetter settle.
- [x] Keep all vertical movement, rotation, and scaling removed.
- [x] Fill the exact traced shapes after construction.
- [x] Keep every outline visible until its corresponding fill is present.
- [x] Slow contour drawing and overlap it with the start of filling.
- [x] Clip contour strokes to the exact final glyph silhouette.
- [x] Remove the secondary holding-page tagline.
- [x] Preserve earlier local options.
- [x] Respect reduced-motion preferences.
- [x] Restart the complete construction sequence on every page reload.
- [x] Replace animated dash geometry with offset-only guide drawing.
- [x] Contain SVG repaint work to the wordmark.
- [x] Verify desktop sequence, mobile layout, visual comparison, and logs.

final result: passed
