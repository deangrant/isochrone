---
name: agent-verification
description: >-
  When and how to run isochrone verification scripts before claiming work is
  done. Use for merge-ready checks, CI parity, and post-edit validation.
---

# Agent verification

## Merge-ready bundle

```bash
pnpm verify
```

Runs: `validate:skills` → `biome ci .` → `test` → `build`.

## When to add React Doctor

| Change | Also run |
| ------ | -------- |
| React components or hooks | `pnpm doctor:full` or `pnpm doctor:changed` |
| Non-React config/docs only | skip doctor |

## Incremental checks

| Goal | Command |
| ---- | ------- |
| Skills/structure only | `pnpm validate:skills` |
| Lint/format only | `pnpm exec biome ci .` |
| Single test file | `pnpm --filter web exec vitest run <path>` |
| Bundle analysis | `pnpm analyze:bundle` |

## CI parity

[`.github/workflows/lint.yml`](../../../.github/workflows/lint.yml): validate:skills, biome ci, test, build.

[`.github/workflows/audit.yml`](../../../.github/workflows/audit.yml): pnpm audit + react-doctor action.

## Rules

- Do not claim a check passed unless it was run and succeeded.
- Hooks auto-format after edit but do not replace `pnpm verify`.
- Use `/isochrone-verify` for the standard agent workflow.
