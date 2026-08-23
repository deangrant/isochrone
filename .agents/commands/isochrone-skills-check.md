# Isochrone skills check

Run structural and JSDoc enforcement. Classify failures and link to the relevant skill.

## Steps

```bash
pnpm validate:skills
```

## On failure

Map errors to skills:

| Error theme | Skill |
| ----------- | ----- |
| JSDoc, block comments, callback voice | `typescript-jsdoc-style` |
| Folder layout, barrels, loose helpers | `typescript-project-structure` |
| Layer inversion, service naming | `typescript-solid-design` + `reachability-web` |
| Reachability file location | `reachability-web` |

Fix violations in code. Do not weaken `scripts/validate-skills.mjs` unless the user asks.

## Output

List each error with suggested skill and fix. Do not commit.
