# Isochrone fix biome

Run Biome CI and fix all reported issues without suppressions or config overrides.

## Steps

```bash
pnpm exec biome ci .
```

If failures are auto-fixable on specific files:

```bash
pnpm exec biome check --write <path>
```

Re-run `pnpm exec biome ci .` until clean.

## Rules

- Do **not** add `biome.json` overrides or inline suppressions.
- Fix source code to satisfy rules.
- Match existing style in touched files.

## Output

Summarize what was fixed and confirm CI is clean. Do not commit.
