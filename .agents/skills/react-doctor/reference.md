# React Doctor reference

## Scripts (root package.json)

| Script | Invokes |
| ------ | ------- |
| `doctor:changed` | `react-doctor --verbose --scope changed --yes` |
| `doctor:full` | `react-doctor --verbose --yes` |
| `doctor` | `react-doctor` passthrough |

Version: see `devDependencies.react-doctor` in root `package.json` (catalog `0.9.1`).

## Triage workflow

1. Read the diagnostic and cited file/line.
2. Classify: true positive / false positive / needs review.
3. Prefer structural fixes over suppressions.
4. Re-run `pnpm doctor:full` after fixes.
5. Run relevant Vitest for touched UI.

## Common isochrone fixes

| Issue | Fix |
| ----- | --- |
| Ref object in effect deps | Pass stable ref identities individually |
| Giant component | Split per map-hook pattern already in repo |
| Missing lazy boundary | Keep `MapView` behind `React.lazy` |

## Rule configuration

```bash
pnpm doctor rules explain <rule>
pnpm doctor rules list --configured
```

Do not disable rules to pass CI without explicit user approval.
