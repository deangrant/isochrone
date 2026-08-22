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
| `pnpm test` | Run unit tests |
| `pnpm check` | Biome lint and format check |

## Architecture

- **`apps/web`** — React + Vite SPA with Mapbox GL map, geocoding, and isochrone calculation via the Mapbox Isochrone API

## Travel modes

Driving, walking, and cycling.

## License

MIT — see [LICENSE](./LICENSE).
