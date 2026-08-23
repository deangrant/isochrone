---
name: reachability-web
description: >-
  Design and implement the Reachability Vite React SPA: Mapbox map, isochrone
  calculation, geocoding, settings panel, export, and context slices. Use when
  changing apps/web Reachability UI, map hooks, or calculation flow.
---

# Reachability web SPA

Apply these rules when you design, implement, or review `apps/web/src` Reachability code.

File map: [reference.md](reference.md).

Use together with:

- [typescript-project-structure](../typescript-project-structure/SKILL.md) for folder layout
- [typescript-solid-design](../typescript-solid-design/SKILL.md) for services and DI
- [react-doctor](../react-doctor/SKILL.md) after large UI refactors

## Scope

- Single page domain: `pages/Reachability/` owns page-local components, constants, utils, types, services, and hooks.
- Shared UI lives in `components/core/` and `components/patterns/` only.
- Mapbox geocoding and isochrone adapters live in top-level `services/`; export download services live under `pages/Reachability/services/`.

## Composition and context

- `ReachabilityContext` exposes narrow hooks — prefer `useReachabilityOrigin`, `useReachabilityCalculationState`, `useReachabilityMap` over the full context when possible.
- Wire Mapbox adapters in `services/app-services.ts`; depend on port types from `types/`.
- Calculation orchestration: `pages/Reachability/utils/run-reachability-calculation.ts`.

## Map and lazy loading

- `ReachabilityLayout` lazy-loads `MapView` via `React.lazy`.
- Prefetch `mapbox-gl` in a layout `useEffect`; import mapbox dynamically inside map hooks.
- Map hook split:
  - `use-mapbox-map-lifecycle.ts` — map instance create/destroy
  - `use-reachability-map-view-sync.ts` — camera/view state
  - `use-reachability-map-layer-sync.ts` — contour layers
  - `use-mapbox-reachability-map.ts` — thin wrapper
- Pass individual stable `useRef` handles to sub-hooks; never put refs in a new object each render.
- Responsive fit padding: `use-map-fit-padding` + `map-fit-padding.ts`.

## Isochrone rules

- Contour minutes must be unique and strictly increasing (`build-contours.ts`).
- `depart_at` and exclude options gated by travel mode (`supportsExclude` on mode config).
- Abort in-flight isochrone/geocode requests on unmount and rapid re-calculate.

## UI patterns

- Modals that must close only via explicit button: `closeOnBackdrop={false}`, `closeOnEscape={false}` (see `ExportContoursModal`, `HelpModal`).
- User-facing copy constants: `reachability-ui-copy.ts`, `reachability-help-content.ts`.
