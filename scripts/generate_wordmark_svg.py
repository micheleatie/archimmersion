#!/usr/bin/env python3
"""Generate the animated Archimmersion wordmark from Avenir Next outlines."""

from html import escape
from pathlib import Path
import re

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTCollection


WORDMARK = "ARCHIMMERSION"
FONT_PATH = Path("/System/Library/Fonts/Avenir Next.ttc")
FONT_INDEX = 5  # Avenir Next Medium
TRACKING = 160
PADDING = 220
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "src/assets/img/wordmark-construction.svg"
SAVED_V1_PATH = (
    Path(__file__).resolve().parents[1]
    / "archive/holding-variants/contour-drawing-v1/wordmark-construction.svg"
)
SAVED_V2_PATH = (
    Path(__file__).resolve().parents[1]
    / "archive/holding-variants/segmented-construction-v2/wordmark-construction.svg"
)


def contour_paths(path_data: str) -> list[str]:
    """Split a compound glyph path into continuous drawable contours."""
    return [part.strip() for part in re.split(r"(?=M)", path_data) if part.strip()]


def point_markup(point: tuple[float, float]) -> str:
    return f"{point[0]:g} {point[1]:g}"


def path_segments(path_data: str) -> list[dict]:
    """Parse an SVG glyph path into geometric line and curve segments."""
    tokens = re.findall(r"[A-Za-z]|-?\d+(?:\.\d+)?", path_data)
    segment_sizes = {"L": 2, "H": 1, "V": 1, "Q": 4, "C": 6}
    segments = []
    cursor = (0.0, 0.0)
    contour_start = cursor
    index = 0

    while index < len(tokens):
        command = tokens[index]
        index += 1

        if command == "M":
            cursor = (float(tokens[index]), float(tokens[index + 1]))
            contour_start = cursor
            index += 2
            continue

        if command == "Z":
            if cursor != contour_start:
                segments.append(
                    {"kind": "L", "start": cursor, "end": contour_start}
                )
            cursor = contour_start
            continue

        value_count = segment_sizes.get(command)
        if value_count is None:
            raise ValueError(f"Unsupported SVG path command: {command}")

        values = [float(value) for value in tokens[index : index + value_count]]
        index += value_count

        if command == "H":
            end = (values[0], cursor[1])
            segment = {"kind": "L", "start": cursor, "end": end}
        elif command == "V":
            end = (cursor[0], values[0])
            segment = {"kind": "L", "start": cursor, "end": end}
        elif command == "L":
            end = (values[0], values[1])
            segment = {"kind": "L", "start": cursor, "end": end}
        elif command == "Q":
            end = (values[2], values[3])
            segment = {
                "kind": "Q",
                "start": cursor,
                "control": (values[0], values[1]),
                "end": end,
            }
        else:
            end = (values[4], values[5])
            segment = {
                "kind": "C",
                "start": cursor,
                "control1": (values[0], values[1]),
                "control2": (values[2], values[3]),
                "end": end,
            }

        segments.append(segment)
        cursor = end

    return segments


def extended_line_path(segment: dict, extension: float, order: int) -> str:
    """Extend a real straight glyph edge beyond both of its endpoints."""
    x1, y1 = segment["start"]
    x2, y2 = segment["end"]
    dx = x2 - x1
    dy = y2 - y1
    length = (dx * dx + dy * dy) ** 0.5
    unit_x = dx / length
    unit_y = dy / length
    start_extension = extension * (0.72 + ((order * 0.17) % 0.45))
    end_extension = extension * (1.08 + ((order * 0.23) % 0.55))
    return (
        f"M{x1 - unit_x * start_extension:g} "
        f"{y1 - unit_y * start_extension:g}"
        f"L{x2 + unit_x * end_extension:g} "
        f"{y2 + unit_y * end_extension:g}"
    )


def extended_straight_guides(
    path_data: str, extension: float, limit: int = 3
) -> list[str]:
    """Extend the longest real straight edges beyond the finished glyph."""
    candidates = []
    for order, segment in enumerate(path_segments(path_data)):
        if segment["kind"] != "L":
            continue

        x1, y1 = segment["start"]
        x2, y2 = segment["end"]
        dx = x2 - x1
        dy = y2 - y1
        length = (dx * dx + dy * dy) ** 0.5
        if length < 100:
            continue

        candidates.append((length, extended_line_path(segment, extension, order)))

    candidates.sort(key=lambda item: item[0], reverse=True)
    return [guide for _, guide in candidates[:limit]]


def is_terminal_diagonal(segment: dict) -> bool:
    if segment["kind"] != "L":
        return False

    x1, y1 = segment["start"]
    x2, y2 = segment["end"]
    dx = x2 - x1
    dy = y2 - y1
    length = (dx * dx + dy * dy) ** 0.5
    return length >= 50 and abs(dx) >= 20 and abs(dy) >= 20


def terminal_diagonal_segments(path_data: str) -> list[dict]:
    """Return the two real diagonal terminal edges used by C and S."""
    candidates = []
    for segment in path_segments(path_data):
        if not is_terminal_diagonal(segment):
            continue
        candidates.append(segment)
    return candidates[:2]


def terminal_diagonal_guides(path_data: str, extension: float) -> list[str]:
    """Extend both real terminal diagonals for an open curved glyph."""
    return [
        extended_line_path(segment, extension, order)
        for order, segment in enumerate(terminal_diagonal_segments(path_data))
    ]


def quadratic_point(segment: dict, t: float) -> tuple[float, float]:
    start = segment["start"]
    control = segment["control"]
    end = segment["end"]
    inverse = 1 - t
    return (
        inverse * inverse * start[0]
        + 2 * inverse * t * control[0]
        + t * t * end[0],
        inverse * inverse * start[1]
        + 2 * inverse * t * control[1]
        + t * t * end[1],
    )


def quadratic_derivative(segment: dict, t: float) -> tuple[float, float]:
    start = segment["start"]
    control = segment["control"]
    end = segment["end"]
    return (
        2 * ((1 - t) * (control[0] - start[0]) + t * (end[0] - control[0])),
        2 * ((1 - t) * (control[1] - start[1]) + t * (end[1] - control[1])),
    )


def extended_quadratic_path(
    segment: dict, t_start: float = 0.35, t_end: float = 2.15
) -> str:
    """Continue a real quadratic glyph curve smoothly beyond its endpoint."""
    start = quadratic_point(segment, t_start)
    end = quadratic_point(segment, t_end)
    derivative = quadratic_derivative(segment, t_start)
    interval = t_end - t_start
    control = (
        start[0] + derivative[0] * interval / 2,
        start[1] + derivative[1] * interval / 2,
    )
    # Reverse the path so the guide visibly draws from its extended end back
    # into the true letter curve instead of hiding its extension until late.
    return f"M{point_markup(end)}Q{point_markup(control)} {point_markup(start)}"


def terminal_curve_guides(path_data: str) -> list[str]:
    """Continue the true curves immediately preceding both terminal edges."""
    segments = path_segments(path_data)
    guides = []
    for index, segment in enumerate(segments):
        if not is_terminal_diagonal(segment) or index == 0:
            continue
        previous = segments[index - 1]
        if previous["kind"] == "Q":
            guides.append(extended_quadratic_path(previous))
    return guides[:2]


def main() -> None:
    collection = TTCollection(FONT_PATH)
    font = collection.fonts[FONT_INDEX]
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]

    letters = []
    cursor_x = 0
    x_min = float("inf")
    y_min = float("inf")
    x_max = float("-inf")
    y_max = float("-inf")

    for index, character in enumerate(WORDMARK):
        glyph_name = cmap[ord(character)]
        glyph = glyph_set[glyph_name]

        path_pen = SVGPathPen(glyph_set)
        glyph.draw(path_pen)
        path_data = path_pen.getCommands()

        bounds_pen = BoundsPen(glyph_set)
        glyph.draw(bounds_pen)
        bounds = bounds_pen.bounds

        if bounds:
            glyph_x_min, glyph_y_min, glyph_x_max, glyph_y_max = bounds
            x_min = min(x_min, cursor_x + glyph_x_min)
            y_min = min(y_min, glyph_y_min)
            x_max = max(x_max, cursor_x + glyph_x_max)
            y_max = max(y_max, glyph_y_max)

        letters.append(
            {
                "index": index,
                "character": character,
                "x": cursor_x,
                "path": path_data,
                "contours": contour_paths(path_data),
                "bounds": bounds,
            }
        )
        cursor_x += hmtx[glyph_name][0]
        if index < len(WORDMARK) - 1:
            cursor_x += TRACKING

    view_x = x_min - PADDING
    view_y = -y_max - PADDING
    view_width = x_max - x_min + (PADDING * 2)
    view_height = y_max - y_min + (PADDING * 2)
    letter_markup = []
    for letter in letters:
        index = letter["index"]
        character = letter["character"]
        clip_id = f"letter-clip-{index}"
        glyph_x_min, glyph_y_min, glyph_x_max, glyph_y_max = letter["bounds"]
        glyph_width = glyph_x_max - glyph_x_min
        extension = 76 + ((index * 31) % 92)

        horizontal_guides = []
        if character not in {"C", "S", "O"}:
            horizontal_guides = [
                (
                    f"M{glyph_x_min - extension * 1.18:g} {glyph_y_max:g}"
                    f"L{glyph_x_max + extension * 0.74:g} {glyph_y_max:g}"
                ),
                (
                    f"M{glyph_x_min - extension * 0.68:g} {glyph_y_min:g}"
                    f"L{glyph_x_max + extension * 1.32:g} {glyph_y_min:g}"
                ),
            ]

        if character == "I":
            guide_paths = [
                *(("horizontal", path) for path in horizontal_guides),
                ("vertical", (
                    f"M{glyph_x_min:g} {glyph_y_min - extension * 0.82:g}"
                    f"L{glyph_x_min:g} {glyph_y_max + extension * 1.2:g}"
                )),
                ("vertical", (
                    f"M{glyph_x_max:g} {glyph_y_min - extension * 1.08:g}"
                    f"L{glyph_x_max:g} {glyph_y_max + extension * 0.76:g}"
                )),
            ]
        elif character in {"C", "S"}:
            guide_paths = [
                *(
                    ("diagonal", path)
                    for path in terminal_diagonal_guides(letter["path"], extension)
                ),
                *(
                    ("curve", path)
                    for path in terminal_curve_guides(letter["path"])
                ),
            ]
        elif character in {"H", "M", "N"}:
            guide_paths = [
                *(("horizontal", path) for path in horizontal_guides),
                *(
                    ("edge", path)
                    for path in extended_straight_guides(letter["path"], extension)
                ),
            ]
        elif character == "O":
            guide_paths = [
                ("vertical", (
                    f"M{glyph_x_min:g} {glyph_y_min - extension * 0.82:g}"
                    f"L{glyph_x_min:g} {glyph_y_max + extension * 1.2:g}"
                )),
                ("vertical", (
                    f"M{glyph_x_max:g} {glyph_y_min - extension * 1.08:g}"
                    f"L{glyph_x_max:g} {glyph_y_max + extension * 0.76:g}"
                )),
            ]
        else:
            guide_paths = [
                *(("horizontal", path) for path in horizontal_guides),
                ("vertical", (
                f"M{glyph_x_min + glyph_width * (0.22 if index % 2 == 0 else 0.78):g} "
                f"{glyph_y_min - extension * 0.82:g}"
                f"L{glyph_x_min + glyph_width * (0.22 if index % 2 == 0 else 0.78):g} "
                f"{glyph_y_max + extension * 1.2:g}"
                )),
                *(
                    ("edge", path)
                    for path in extended_straight_guides(letter["path"], extension)
                ),
            ]

        guide_markup = []
        for guide_index, (guide_type, guide) in enumerate(guide_paths):
            guide_markup.append(
                (
                    f'<path class="draft-guide guide-{guide_type}" '
                    f'd="{escape(guide, quote=True)}" pathLength="1" '
                    f'style="--guide-delay: {index * 22 + guide_index * 55}ms" />'
                )
            )

        contour_markup = []
        for contour_index, contour in enumerate(letter["contours"]):
            contour_markup.append(
                (
                    '<path class="outline-trace" '
                    f'd="{escape(contour, quote=True)}" pathLength="1" '
                    f'clip-path="url(#{clip_id})" '
                    f'style="--outline-delay: '
                    f'{140 + index * 26 + contour_index * 38}ms" />'
                )
            )

        letter_markup.append(
            "\n".join(
                [
                    f'<g transform="translate({letter["x"]} 0)">',
                    (
                        f'<clipPath id="{clip_id}" clipPathUnits="userSpaceOnUse">'
                        f'<path d="{escape(letter["path"], quote=True)}" />'
                        "</clipPath>"
                    ),
                    (
                        f'<g class="letter" data-letter="{character}" '
                        f'data-index="{index}" style="--construct-x: '
                        f'{(index - (len(WORDMARK) - 1) / 2) * 12:g}px; '
                        f'--letter-delay: {index * 22}ms">'
                    ),
                    *guide_markup,
                    (
                        '<path class="letter-fill" '
                        f'd="{escape(letter["path"], quote=True)}" '
                        f'style="--fill-delay: {1580 + index * 18}ms" />'
                    ),
                    *contour_markup,
                    "</g>",
                    "</g>",
                ]
            )
        )

    svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="{view_x:.2f} {view_y:.2f} {view_width:.2f} {view_height:.2f}"
  role="img"
  aria-label="Archimmersion">
  <style>
    .letter {{
      animation: settle-letter 3.26s linear both;
      transform: translateX(var(--construct-x));
      transform-box: fill-box;
      transform-origin: center;
    }}

    .draft-guide {{
      --guide-opacity: 0.22;
      animation: draw-guide 1.9s linear both;
      animation-delay: var(--guide-delay);
      fill: none;
      stroke: #161616;
      stroke-dasharray: 0 1;
      stroke-dashoffset: 0;
      stroke-linecap: round;
      stroke-opacity: 0;
      stroke-width: 0.85;
      vector-effect: non-scaling-stroke;
    }}

    .guide-diagonal {{
      --guide-opacity: 0.26;
    }}

    .guide-curve {{
      --guide-opacity: 0.3;
      stroke-width: 1;
    }}

    .outline-trace {{
      animation: draw-outline 2.8s cubic-bezier(0.4, 0, 0.2, 1) both;
      animation-delay: var(--outline-delay);
      fill: none;
      stroke: #161616;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-opacity: 0;
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
    }}

    .letter-fill {{
      animation: fill-letter 460ms ease-out both;
      animation-delay: var(--fill-delay);
      fill: #161616;
      fill-opacity: 0;
      stroke: none;
    }}

    @keyframes settle-letter {{
      0%,
      8% {{
        transform: translateX(var(--construct-x));
      }}

      100% {{
        transform: translateX(0);
      }}
    }}

    @keyframes draw-guide {{
      0%,
      3% {{
        stroke-dasharray: 0 1;
        stroke-opacity: var(--guide-opacity);
      }}

      60% {{
        stroke-dasharray: 1 0;
        stroke-opacity: var(--guide-opacity);
      }}

      84% {{
        stroke-dasharray: 1 0;
        stroke-opacity: var(--guide-opacity);
      }}

      100% {{
        stroke-dasharray: 1 0;
        stroke-opacity: 0;
      }}
    }}

    @keyframes draw-outline {{
      0% {{
        stroke-dashoffset: 1;
        stroke-opacity: 0;
      }}

      8% {{
        stroke-opacity: 0.62;
      }}

      64% {{
        stroke-dashoffset: 0;
        stroke-opacity: 0.62;
      }}

      92% {{
        stroke-dashoffset: 0;
        stroke-opacity: 0.62;
      }}

      100% {{
        stroke-dashoffset: 0;
        stroke-opacity: 0;
      }}
    }}

    @keyframes fill-letter {{
      0% {{
        fill-opacity: 0;
      }}

      100% {{
        fill-opacity: 1;
      }}
    }}

    @media (prefers-reduced-motion: reduce) {{
      .draft-guide,
      .outline-trace,
      .letter-fill,
      .letter {{
        animation: none;
      }}

      .letter {{
        transform: none;
      }}

      .draft-guide,
      .outline-trace {{
        stroke-opacity: 0;
      }}

      .letter-fill {{
        fill-opacity: 1;
      }}
    }}
  </style>
  <g transform="scale(1 -1)">
    {"".join(letter_markup)}
  </g>
</svg>
"""

    OUTPUT_PATH.write_text(svg, encoding="utf-8")
    print(f"Wrote {OUTPUT_PATH}")
    if not SAVED_V1_PATH.exists():
        SAVED_V1_PATH.parent.mkdir(parents=True, exist_ok=True)
        SAVED_V1_PATH.write_text(svg, encoding="utf-8")
        print(f"Saved option {SAVED_V1_PATH}")
    if not SAVED_V2_PATH.exists():
        SAVED_V2_PATH.parent.mkdir(parents=True, exist_ok=True)
        SAVED_V2_PATH.write_text(svg, encoding="utf-8")
        print(f"Saved option {SAVED_V2_PATH}")


if __name__ == "__main__":
    main()
