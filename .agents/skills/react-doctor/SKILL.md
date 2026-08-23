---
name: react-doctor
description: >-
  Use when finishing a feature, fixing a bug, before committing React code, or
  when the user runs /isochrone-doctor. Covers lint, accessibility, bundle size,
  and React architecture diagnostics.
---

# React Doctor

**Core principle:** `react-doctor` is a pinned devDependency in root
[`package.json`](../../../package.json). Always invoke via `pnpm run doctor*`
scripts — never `npx react-doctor@latest`.

## After React code changes

Run `pnpm doctor:changed` and confirm the score did not regress.

## Full scan

Run `pnpm doctor:full` for a full codebase scan. Fix errors first, then warnings.

## Map hook guidance (this repo)

- Do not put `useRef` handles in a new object each render and list that object in `useEffect` deps.
- Pass individual stable ref identities into `use-mapbox-map-lifecycle`, `use-reachability-map-view-sync`, and `use-reachability-map-layer-sync`.

## Scripts

| Script | Command | Purpose |
| ------ | ------- | ------- |
| `doctor:changed` | `pnpm doctor:changed` | Regression check after React edits |
| `doctor:full` | `pnpm doctor:full` | Full codebase scan |
| `doctor` | `pnpm doctor …` | Passthrough for ad-hoc flags |

## Cursor hook

[`.agents/hooks/react-doctor-after-file-edit.sh`](../../hooks/react-doctor-after-file-edit.sh) runs an advisory lines-scope scan in the background after `src/**/*.ts(x)` edits. Registered in [`.cursor/hooks.json`](../../../.cursor/hooks.json).

Details: [reference.md](reference.md).
