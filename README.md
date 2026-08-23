# Reachability Map

A **reachability explorer** powered by [Mapbox](https://www.mapbox.com/) isochrones.

Search for a start location, pick a travel mode and one or more time limits, and
see how far you can travel on the map. Export contour polygons as GeoJSON or WKT
for use in GIS tools or your own apps.

The app runs entirely in the browser. It calls Mapbox for the map, forward
geocoding, and isochrone calculation. There is no backend service in this
repository.

## Architecture at a glance

```text
Browser (Vite React SPA) ──► Mapbox GL JS (map tiles)
         │
         ├──► Mapbox Geocoding API (location search)
         └──► Mapbox Isochrone API (travel-time contours)
```

| Package | Role |
| --- | --- |
| [`apps/web`](apps/web) | Vite React SPA — settings panel, lazy Mapbox map, geocoding, isochrone calculation, export |

Deeper module maps, calculation flow, and bundle strategy:
[`.agents/docs/ARCHITECTURE.md`](.agents/docs/ARCHITECTURE.md).

## Requirements

- Node.js `>=22`
- [pnpm](https://pnpm.io/) `11.8.0` (pinned via `packageManager` in root `package.json`)

```bash
corepack enable
pnpm install
```

## Configuration

```bash
cp apps/web/.env.example apps/web/.env
```

| Variable | Required | Notes |
| --- | --- | --- |
| `VITE_MAPBOX_GL_JS_PUBLIC` | Yes | Public Mapbox token (`pk.*`). Enable **Maps**, **Geocoding**, and **Isochrone API** scopes in your [Mapbox account](https://account.mapbox.com/). Restrict token URLs in the [Mapbox token UI](https://docs.mapbox.com/accounts/guides/tokens/#url-restrictions) — include `http://localhost:5173` for local development. |

## Develop

```bash
pnpm dev
```

| Process | URL |
| --- | --- |
| Vite app | [http://localhost:5173](http://localhost:5173) |

If Vite picks a different port because `:5173` is busy, add that origin to your
Mapbox token URL restrictions.

## Build

```bash
pnpm build
```

Production output is written to `apps/web/dist/`.

To inspect bundle composition after a build:

```bash
pnpm analyze:bundle
```

Opens `apps/web/dist/stats.html` — a treemap useful for PR and performance review.

## Test and quality

```bash
pnpm verify        # validate:skills + Biome CI + test + build (local CI parity)
pnpm test          # Vitest unit tests (apps/web)
pnpm check         # Biome format + lint
pnpm doctor:full   # React Doctor full scan on the web app
```

CI (see [`.github/workflows/`](.github/workflows/)):

- `lint.yml` — skills validation, Biome CI, Vitest, production build, lockfile check
- `audit.yml` — dependency audit and React Doctor

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Run the web app in development |
| `pnpm build` | Production build (`apps/web`) |
| `pnpm test` | Run Vitest unit tests |
| `pnpm verify` | Full local CI: `validate:skills`, Biome CI, test, build |
| `pnpm check` | Biome check (format + lint) |
| `pnpm format` / `pnpm lint` | Format or lint only |
| `pnpm validate:skills` | Enforce project structure and JSDoc rules |
| `pnpm doctor` / `pnpm doctor:full` / `pnpm doctor:changed` | React Doctor |
| `pnpm analyze:bundle` | Production build with bundle treemap |

## What you can configure

| Setting | Behavior |
| --- | --- |
| Location | Forward geocode search or paste coordinates |
| Travel mode | Driving, Traffic, Walking, Cycling (Mapbox routing profiles) |
| Time intervals | One or more contour minutes (unique, strictly increasing) |
| Exclude (driving modes) | Optional road classes to avoid (tolls, motorways, ferries, cash-only tolls) |
| Depart at | Optional departure time for traffic-aware profiles |
| Contour smoothing | Denoise and generalize parameters passed to the Isochrone API |
| Export | Download contours as **GeoJSON** or **WKT** |

Open the in-app **User guide** (help control on the map) for plain-language
explanations of each setting.

## Data sources and attribution

- Location search: [Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/)
- Travel-time contours: [Mapbox Isochrone API](https://docs.mapbox.com/api/navigation/isochrone/)
- Map display: [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) (`mapbox://styles/mapbox/light-v11`)

Map data © [Mapbox](https://www.mapbox.com/) © [OpenStreetMap](https://www.openstreetmap.org/copyright).

## Known limitations

- **Client-side only.** The Mapbox public token is bundled into the web app at
  build time. Use URL restrictions and scoped tokens; do not commit secrets.
- **Mapbox quotas and billing.** Geocoding and isochrone requests count against
  your Mapbox account limits.
- **No offline mode.** The app requires network access to Mapbox services.
- **Large map vendor chunk.** Mapbox GL is lazy-loaded to keep the initial
  payload small, but the vendor chunk is still ~500 KB gzip. See
  [ARCHITECTURE.md](.agents/docs/ARCHITECTURE.md) for bundle boundaries.

## Agents and docs

| Doc | Purpose |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | Agent orientation, skills, commands, definition of done |
| [`.agents/docs/ARCHITECTURE.md`](.agents/docs/ARCHITECTURE.md) | System architecture and module maps |
| [`.agents/docs/DESIGN.md`](.agents/docs/DESIGN.md) | Design tokens and UI conventions |
| [DeepWiki](https://deepwiki.com/deangrant/isochrone) | Indexed project wiki |
| [`.agents/skills/`](.agents/skills/) | Task-specific implementation skills |

## License

MIT — see [LICENSE](./LICENSE).
