---
version: alpha
name: Reachability Map
description: >-
  Dark forest reachability explorer with soft teal accent, frosted settings
  panel chrome, Sora UI type, and a light Mapbox canvas under dark overlays.
colors:
  background: "#0f1a17"
  background-elevated: "#162420"
  background-panel: "#1a2c27"
  surface-chrome: "rgb(15 26 23 / 94%)"
  surface-map-fallback: "#e8e4dc"
  modal-backdrop: "rgb(6 14 12 / 72%)"
  on-background: "#e8f0ec"
  on-background-muted: "#9bb0a6"
  on-accent: "#06140f"
  outline: "#2a4038"
  outline-strong: "#3d5a4e"
  accent: "#3d9b7a"
  accent-strong: "#2f7d62"
  accent-soft: "rgb(61 155 122 / 18%)"
  danger: "#d9786a"
  danger-soft: "rgb(217 120 106 / 12%)"
  marker: "#3d9b7a"
  marker-selected: "#2f7d62"
  marker-stroke: "#ffffff"
  contour-fill-default: "#3d9b7a"
  contour-line-default: "#2f7d62"
  wash-teal: "rgb(61 155 122 / 18%)"
  wash-gold: "rgb(240 195 90 / 8%)"
typography:
  body-md:
    fontFamily: Sora
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.45
  body-sm:
    fontFamily: Sora
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.4
  input:
    fontFamily: Sora
    fontSize: 0.9rem
    fontWeight: 400
    lineHeight: 1.45
  label-sm:
    fontFamily: Sora
    fontSize: 0.68rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.04em
    textTransform: uppercase
  hint-sm:
    fontFamily: Sora
    fontSize: 0.8rem
    fontWeight: 400
    lineHeight: 1.35
  button-md:
    fontFamily: Sora
    fontSize: 0.875rem
    fontWeight: 600
    lineHeight: 1.2
  title-md:
    fontFamily: Sora
    fontSize: 1.05rem
    fontWeight: 600
    lineHeight: 1.3
  tile-label:
    fontFamily: Sora
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.2
rounded:
  sm: 6px
  md: 10px
  full: 9999px
spacing:
  "1": 0.25rem
  "2": 0.5rem
  "3": 0.75rem
  "4": 1rem
  "5": 1.5rem
  "6": 2rem
  side-panel-width: 360px
  side-panel-sheet-height: 52vh
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: 0.55rem 0.95rem
  button-primary-hover:
    backgroundColor: "{colors.accent-strong}"
    textColor: "{colors.on-accent}"
  button-secondary:
    backgroundColor: "{colors.background-elevated}"
    textColor: "{colors.on-background}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: 0.55rem 0.95rem
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.on-background-muted}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-background}"
    typography: "{typography.input}"
    rounded: "{rounded.sm}"
    padding: 0.55rem 0.7rem
  side-panel:
    backgroundColor: "{colors.surface-chrome}"
    textColor: "{colors.on-background}"
    rounded: "{rounded.md}"
    width: "{spacing.side-panel-width}"
  modal-panel:
    backgroundColor: "{colors.background-panel}"
    textColor: "{colors.on-background}"
    rounded: "{rounded.md}"
  help-modal-panel:
    backgroundColor: "{colors.background-panel}"
    textColor: "{colors.on-background}"
    rounded: "{rounded.md}"
    maxWidth: 48rem
  map-control:
    backgroundColor: "{colors.background-panel}"
    textColor: "{colors.on-background}"
    rounded: "{rounded.full}"
    size: 2.5rem
  travel-mode-tile:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-background}"
    rounded: "{rounded.sm}"
  travel-mode-tile-selected:
    backgroundColor: "{colors.accent-soft}"
    borderColor: "{colors.accent}"
---

# Reachability Map

## Overview

Reachability Map is a dark, map-first isochrone explorer. The personality is calm
and operational: a deep forest canvas with soft teal and gold radial washes,
frosted dark chrome over a **light** Mapbox map (`mapbox://styles/mapbox/light-v11`),
and elevated green panels for settings, help, and export dialogs. Teal (`accent`)
is the single brand action color — primary buttons, focus rings, links, selected
travel-mode tiles, and default contour fills. Sora carries all UI chrome. The
emotional target is focused and geographic, not playful and not neon. Default
presentation is **dark mode only** (`color-scheme: dark`); there is no light
theme in the current token set.

Canonical CSS tokens live in
[`apps/web/src/styles/global.css`](../../apps/web/src/styles/global.css).

## Colors

The palette is dark forest neutrals plus one teal accent and restrained danger.

- **Accent (#3d9b7a):** Teal for primary actions, focus outlines, links, selected
  travel-mode tiles, and default isochrone fill. Stronger `#2f7d62` for hover,
  contour outlines, and selected emphasis. Soft tint `rgba(61, 155, 122, 0.18)`
  for ghost hover, autocomplete active rows, and tile selection.
- **On-accent (#06140f):** Near-black ink on filled primary buttons. Documented
  here as a role; the Button CSS still inlines this hex today.
- **Ink (#e8f0ec):** Light mint body text; muted `#9bb0a6` for labels, hints,
  and secondary chrome.
- **Surfaces:** Page `#0f1a17`; elevated `#162420`; panel `#1a2c27`; frosted
  settings chrome `rgba(15, 26, 23, 0.94)`.
- **Outline:** Soft green borders `#2a4038` / `#3d5a4e`.
- **Danger (#d9786a):** Errors and validation messages only — often paired with
  soft danger background `rgba(217, 120, 106, 0.12)` and border
  `rgba(217, 120, 106, 0.35)` in panel and modal alerts.
- **Map canvas fallback (#e8e4dc):** Warm light gray behind the map while
  Mapbox loads or when the token is missing — matches the light map style.
- **Contour paint:** Default fill `#3d9b7a`, line `#2f7d62`, origin marker
  `#3d9b7a` with white stroke. Keep Mapbox layer paint centralized in
  [`map-layers.ts`](../../apps/web/src/pages/Reachability/utils/map-layers.ts)
  and [`map-helpers.ts`](../../apps/web/src/pages/Reachability/utils/map-helpers.ts).

Do not introduce a second saturated brand color. Keep purple, cream landing
themes, and glow effects out of the product chrome. The faint gold wash on the
page background is atmospheric only — not a second action color.

## Typography

One family only:

- **Sora** — shell, settings panel, buttons, labels, modals, map controls.
  Loaded via `@fontsource/sora` latin subsets (`latin-400`, `latin-600`).
  Fallbacks: `"Avenir Next", "Segoe UI", sans-serif`.

Weights stay practical (400 body, 500 tile labels, 600 labels/buttons). Form
labels in the settings panel use uppercase micro type where present. Avoid
display/hero type scales; this is a map workspace, not a marketing page.

## Layout

The shell is a full-viewport map with a frosted settings panel overlay and a
floating map-controls column.

- **Desktop:** Settings panel `min(360px, calc(100% - 1.5rem))` wide, inset
  `--space-3` from top/left/bottom (`REACHABILITY_SIDE_PANEL_MAX_WIDTH_PX`).
- **≤1100px:** Panel becomes a bottom sheet (`height: min(52vh, 520px)`),
  full width with `--space-2` inset (`REACHABILITY_LAYOUT_BREAKPOINT_PX`).
- **Modals:** Default export modal up to `36rem`; User guide (`HelpModal`) up to
  `48rem` wide for denser documentation content.
- **Map controls:** Circular `2.5rem` buttons, top-right stack with
  `--space-2` gap; Help is always first in the stack.
- **Spacing:** 4px-based rem scale (`--space-1` … `--space-6`). Settings panel
  uses compact `--space-3` / `--space-4` grouping; modals use `--space-5`.

## Elevation & Depth

Depth is tonal and frosted, with one shared panel shadow:

- Page background: dual radial washes (teal + soft gold) over `--color-bg`.
- Settings panel: translucent forest chrome with `backdrop-filter: blur(10px)`.
- Shadow: `--shadow-panel` (`0 12px 40px rgba(0, 0, 0, 0.35)`) on side panel,
  modals, autocomplete menus, and map controls.
- Hierarchy: light map canvas < frosted chrome < elevated / panel surfaces <
  modal.

Short enter motions (`panelIn`, `sheetIn`) animate the settings panel on
desktop and mobile. Do not add noisy ambient animation.

## Shapes

Corner language is restrained:

- **6px (`--radius-sm`)** — buttons, inputs, travel-mode tiles, autocomplete
  menus, error chips.
- **10px (`--radius-md`)** — settings panel, modals, help topic cards.
- **Circle (`border-radius: 50%`)** — map control buttons only.

Keep radii consistent; do not mix large marketing-card radii into the explorer.

## Components

Map new UI to existing patterns under `apps/web/src/components/` and
`pages/Reachability/components/`:

- **Buttons** — `primary` (teal fill + on-accent text), `secondary` (elevated +
  strong border), `ghost` (muted text). `fullWidth` for panel actions.
- **Inputs** — dark field on `--color-bg`, soft border; stronger border on
  hover/focus; optional clear control.
- **Autocomplete** — elevated suggestion list with `accent-soft` active/hover row.
- **TravelModeTiles** — 4-column grid; selected tile uses `accent-soft` fill and
  accent border.
- **Modal** — panel surface, strong border, shared panel shadow; export and help
  flows may disable backdrop/Escape close when explicit Close is required.
- **HelpModal** — wider panel (`48rem`), section cards on `bg-elevated`, intro
  callout with left accent border.
- **Map controls** — circular elevated buttons; hover shifts to accent color.
- **IsochronePanel** — scrollable settings stack with section labels, error
  banner using danger soft treatment.
- **Map** — Mapbox `light-v11` under dark UI; contour and marker paint from
  `map-layers.ts` / `map-helpers.ts`, not scattered hex in random modules.

App code should use CSS variables from `global.css` rather than hard-coded hex
in new modules when a token already exists.

## Do's and Don'ts

### Do

- Keep the experience dark, forest-green, and map-first.
- Use teal only for action, focus, selection, links, and brand emphasis.
- Use Sora for UI chrome; match existing label/button weight scales.
- Prefer borders + tonal surfaces; reuse `--shadow-panel` sparingly.
- Match spacing to the existing `--space-*` scale and compact panel density.
- Keep Mapbox layer/paint colors centralized under Reachability map helpers.
- Respect the `1100px` bottom-sheet breakpoint for panel layout and map padding.

### Don't

- Invent purple, cream, light-landing, or neon themes on Reachability surfaces.
- Swap in Inter/Roboto/system-only stacks or decorative display fonts.
- Turn the product into a light dashboard without a deliberate token redesign.
- Use large card radii or pill primary buttons.
- Scatter contour/marker hex outside `map-layers.ts` and `map-helpers.ts`.
- Hard-code one-off colors when a token in `global.css` already covers the role.
- Override modal close behavior (backdrop/Escape) without an explicit product reason.
