---
name: vitest-reachability
description: >-
  Write and run Vitest suites for apps/web: jsdom, Testing Library, colocated
  tests, and mocked Mapbox/fetch. Use when adding or fixing Reachability tests.
---

# Vitest (Reachability)

Apply when adding or changing tests under `apps/web/src`.

## Rules

- Colocate `*.test.ts` / `*.test.tsx` next to the module under test.
- **Must not** call live Mapbox Geocoding or Isochrone APIs in unit tests.
- Mock `fetch`, service ports, and map hooks as needed.
- Run narrow: `pnpm --filter web exec vitest run <path>`.

## Setup

- Config: `apps/web/vite.config.ts` (Vitest via `vitest/config`).
- Test setup: `apps/web/src/test/setup.ts` if present; use `@testing-library/react` + `jsdom`.

## High-value test areas

| Area | Focus |
| ---- | ----- |
| `mapbox-geocoding-service` | URL params, short query, malformed response, abort |
| `use-reachability-origin` | Query edits, coordinate parsing, clear origin |
| `run-reachability-calculation` | Bounds, exclude gating, depart_at |
| `use-reachability-calculation` | Abort, double-calculate, unmount |
| `build-contours` | Duplicate intervals throw |
| `parse-coordinates` | Lon-lat order, boundary values |
| `LocationSearch` | Duplicate suggestion labels |
| Export services | Download triggers, error paths |

## Commands

```bash
pnpm test                              # full web suite
pnpm --filter web exec vitest run path/to/file.test.ts
```
