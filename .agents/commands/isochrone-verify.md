# Isochrone verify

Run the local CI checklist. Report pass/fail for each step. Fix failures only if the user asks.

## Steps

From the repository root:

```bash
pnpm validate:skills
pnpm exec biome ci .
pnpm test
pnpm build
```

If React components or hooks under `apps/web/src` changed, also run:

```bash
pnpm doctor:full
```

Or use the combined script for the core four:

```bash
pnpm verify
```

## Output

Summarize each command as pass or fail with the first failing error line if any. Do not commit.
