# Reachability file map

## Layout and entry

| Path | Role |
| ---- | ---- |
| `apps/web/src/app.tsx` | App shell |
| `pages/Reachability/ReachabilityLayout/` | Page layout; lazy `MapView` |
| `contexts/ReachabilityContext/` | State slices and providers |

## Context hooks

| Hook | Concern |
| ---- | ------- |
| `use-reachability-origin.ts` | Search query, geocoding, origin coordinates |
| `use-reachability-calculation.ts` | Calculate, abort, calculating state |
| `use-reachability-map-state.ts` | Contours, bounds, map view |
| `use-reachability-settings-state.ts` | Travel mode, intervals, exclude, depart_at |
| `use-geocoding-suggestions.ts` | Autocomplete suggestions |

## Map hooks (`pages/Reachability/hooks/`)

| File | Role |
| ---- | ---- |
| `use-mapbox-map-lifecycle.ts` | Mapbox instance lifecycle |
| `use-reachability-map-view-sync.ts` | View/camera sync |
| `use-reachability-map-layer-sync.ts` | Contour layer sync |
| `use-mapbox-reachability-map.ts` | Composes the three above |
| `use-map-fit-padding.ts` | Panel-aware fitBounds padding |
| `use-isochrone-panel-handlers.ts` | Panel calculate/clear handlers |

## Key utils and services

| Path | Role |
| ---- | ---- |
| `utils/run-reachability-calculation.ts` | Isochrone API orchestration |
| `utils/build-contours.ts` | Contour spec validation |
| `utils/map-fit-padding.ts` | Padding from panel rect |
| `services/mapbox-geocoding-service.ts` | Geocoding adapter |
| `services/mapbox-isochrone-service.ts` | Isochrone adapter |
| `services/app-services.ts` | Composition root |
| `pages/Reachability/services/geojson-download-service.ts` | GeoJSON export |
| `pages/Reachability/services/wkt-download-service.ts` | WKT export |

## Constants

| Path | Role |
| ---- | ---- |
| `constants/mapbox.constants.ts` | App-wide Mapbox token accessor |
| `pages/Reachability/constants/travel-modes.constants.ts` | Mode config |
| `pages/Reachability/constants/reachability-layout.constants.ts` | Layout breakpoints |
| `pages/Reachability/constants/reachability-help-content.ts` | Help modal copy |
