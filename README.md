# Reachability Map

A map-based web app for exploring travel reachability (isochrones). Search for a start location, choose a travel mode and time limits, and visualize how far you can travel on the map. Export results as GeoJSON polygons.

## Requirements

- Node.js `>=22`
- [pnpm](https://pnpm.io/) `11.8.0` (pinned via `packageManager` in `package.json`)

```bash
corepack enable
```

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Configure environment:

   ```bash
   cp apps/web/.env.example apps/web/.env
   ```

   Set `VITE_MAPBOX_GL_JS_PUBLIC` to your Mapbox public token in `apps/web/.env`.

   The token must have **Maps**, **Geocoding**, and **Isochrone API** scopes enabled in your [Mapbox account](https://account.mapbox.com/).

3. Start the web app:

   ```bash
   pnpm dev
   ```

   Web: [http://localhost:5173](http://localhost:5173)

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Run the web app in development |
| `pnpm build` | Production build |
| `pnpm analyze:bundle` | Production build with bundle treemap at `apps/web/dist/stats.html` |
| `pnpm test` | Run unit tests |
| `pnpm check` | Biome lint and format check |

## Architecture

- **`apps/web`** — React + Vite SPA with Mapbox GL map, geocoding, and isochrone calculation via the Mapbox Isochrone API

## Bundle strategy

Mapbox GL is a large vendor dependency (~1.8 MB / ~502 KB gzip) and is intentionally kept out of the initial JavaScript payload.

**Lazy boundaries**

- `MapView` — loaded via `React.lazy` when the reachability layout mounts; mapbox-gl is dynamically imported inside the map hook so the MapView chunk does not synchronously depend on mapbox at module evaluation time
- `ExportContoursModal` — loaded on demand when the user opens export

**Chunk isolation**

- `vite.config.ts` places `mapbox-gl` in a dedicated `mapbox` vendor chunk via `manualChunks`
- `chunkSizeWarningLimit: 1900` is set intentionally for that isolated vendor chunk only

**Approximate production sizes** (run `pnpm build` to refresh)

| Chunk | Gzip |
| --- | --- |
| `index` (app shell + panel) | ~70 KB |
| `MapView` | ~2.3 KB |
| `mapbox` (vendor) | ~502 KB |
| `ExportContoursModal` | ~2.4 KB |

**Analysis**

```bash
pnpm analyze:bundle
```

Opens `apps/web/dist/stats.html` — a treemap of chunk composition for PR/review discussion.

**Critical-path trims**

- Mapbox CSS and attribution overrides load with `MapView`, not the entry bundle
- Sora fonts use latin subsets only (`@fontsource/sora/latin-400.css`, `latin-600.css`)

## Travel modes

Driving, walking, and cycling.

## License

MIT — see [LICENSE](./LICENSE).
