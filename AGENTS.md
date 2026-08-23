# Contributor Guidance

Guidance for AI agents and humans working in this repository.

**New task?** Glance → route → skill → change → verify.

This file is the entry point for repository conventions. Keep detailed architecture,
implementation guidance, and task-specific instructions in the referenced files rather
than duplicating them here.

Canonical agent assets live under [`.agents/`](.agents/); [`.cursor/rules`](.cursor/rules),
[`.cursor/commands`](.cursor/commands), and [`.cursor/hooks.json`](.cursor/hooks.json)
symlink or point there for editor integration.

## Repository at a glance

Reachability Map is a browser-based isochrone explorer. Users search for a start
location, choose travel mode and time limits, visualize reachability on a Mapbox
map, and export contours as GeoJSON or WKT.

| Package / area | Path | Role |
| -------------- | ---- | ---- |
| Web SPA | `apps/web` | React + Vite UI; Mapbox map, geocoding, isochrone API |
| Reachability page | `apps/web/src/pages/Reachability/` | Page-local components, constants, utils, types, services, hooks |
| Shared UI | `apps/web/src/components/` | `core/` and `patterns/` only |
| Services | `apps/web/src/services/` | Mapbox geocoding and isochrone adapters |
| Types | `apps/web/src/types/` | Service ports and shared client types |
| Skills CI | `scripts/validate-skills.mjs` | Structural and JSDoc enforcement for `apps/web/src` |

**Hard invariants (never violate):**

- No component-layer barrel files (`components/core/index.ts`, etc.).
- Page-only Reachability code under `pages/Reachability/{components,constants,utils,types,services,hooks}/`.
- Top-level `constants/` is limited to `mapbox.constants.ts`; top-level `utils/` to shared DateTimePicker helpers.
- `utils/` and `constants/` must not import component `index.types`.
- Depend on service ports from `types/`; wire Mapbox concretes only in `services/app-services.ts`.
- `mapbox-gl` is lazy-loaded; `MapView` stays behind `React.lazy`.
- Contour minutes must be unique and strictly increasing.
- Never add Biome suppressions or config overrides to pass lint.

**Runtime:** Node.js `>=22`, pnpm `11.8.0` (pinned via `packageManager`). Local dev: Vite
`:5173`. Build: `pnpm build` (`apps/web` only).

Mapbox public token (`VITE_MAPBOX_GL_JS_PUBLIC`) must have **Maps**, **Geocoding**, and
**Isochrone API** scopes. The browser calls Mapbox directly; there is no backend BFF.

## Instruction Precedence

When instructions conflict, apply the most specific applicable instruction:

1. Repository-level `AGENTS.md`
2. Applicable files under `.agents/rules/`
3. Applicable files under `.agents/skills/`
4. Relevant documentation under `.agents/docs/`
5. Existing local implementation conventions

More specific guidance takes precedence over general guidance.

Rules define repository constraints and invariants. Skills provide task-specific
implementation guidance. Documentation provides architectural and product context.

Always-on rules under `.agents/rules/` are injected by Cursor on every turn.
This file tells you **when to load** skills and docs; rules state **what you must not do**.
If a skill suggests something a rule forbids, the rule wins.

## Operating Principles

- Make the smallest change that correctly solves the task.
- Preserve existing architecture, folder boundaries, and public contracts unless the task requires changing them.
- Prefer existing components, utilities, and patterns before introducing new abstractions or dependencies.
- Do not refactor unrelated code while completing a task.
- Do not weaken, bypass, or remove repository rules or `validate:skills` checks to make a change easier.
- Keep changes focused, reviewable, and consistent with the surrounding code.
- Treat generated files, configuration, and service port contracts as potentially significant; inspect their existing conventions before modifying them.

## Common mistakes

- Putting Reachability-only helpers in top-level `utils/` or `constants/` instead of `pages/Reachability/`.
- Adding component-layer barrel files or importing through `components/core/index.ts`-style paths.
- Importing Mapbox adapter types from UI instead of depending on ports in `types/`.
- Bundling `mapbox-gl` synchronously at module scope instead of dynamic import inside map hooks.
- Recreating refs in a new object each render and listing that object in `useEffect` deps (map hooks).
- Adding Biome suppressions or `biome.json` overrides instead of fixing source.
- Claiming CI or verification passed without running the commands.
- Committing without an explicit user request.

## Workflow

Before changing code:

1. Inspect the repository status and relevant diff.
2. Identify the files and architectural area affected.
3. Read the applicable rules.
4. Read the matching skill(s) before modifying that area.
5. Check [ARCHITECTURE.md](.agents/docs/ARCHITECTURE.md) or [DESIGN.md](.agents/docs/DESIGN.md) when the change crosses layout, map, or UI boundaries.
6. Make the smallest appropriate change.
7. Run the narrowest relevant tests, checks, and builds first.
8. Run `/isochrone-verify` before considering the change complete when practical.
9. Review the final diff for unintended changes.

Do not read every skill or document by default. Load only the guidance relevant to
the task being performed.

## Task routing

Read the matching skill **before** editing that area. Load only what the task needs.

| If you are changing… | Read first |
| -------------------- | ---------- |
| Reachability UI, map, contexts, isochrone flow | [`reachability-web`](.agents/skills/reachability-web/) |
| New components / folder layout | [`typescript-project-structure`](.agents/skills/typescript-project-structure/) |
| Services, DI, module boundaries | [`typescript-solid-design`](.agents/skills/typescript-solid-design/) |
| JSDoc / comments | [`typescript-jsdoc-style`](.agents/skills/typescript-jsdoc-style/) |
| Tests | [`vitest-reachability`](.agents/skills/vitest-reachability/) |
| React structure / a11y / bundle issues | [`react-doctor`](.agents/skills/react-doctor/) |
| Verification / definition of done | [`agent-verification`](.agents/skills/agent-verification/) |

Cross-cutting changes (e.g. new context slice + map hook + service port): read
[ARCHITECTURE.md](.agents/docs/ARCHITECTURE.md) and every affected skill.

## Repository Documentation

- [`.agents/docs/ARCHITECTURE.md`](.agents/docs/ARCHITECTURE.md) — system context, calculation flow, SPA module map, bundle strategy, and invariants
- [`.agents/docs/DESIGN.md`](.agents/docs/DESIGN.md) — design tokens, typography, component recipes, and UI conventions
- [DeepWiki](https://deepwiki.com/deangrant/isochrone) — indexed project wiki for additional architecture, API, and pipeline context

## Rules

Canonical repository rules live under [`.agents/rules/`](.agents/rules/). The directory
is symlinked from [`.cursor/rules`](.cursor/rules).

Read all rules marked as always-on and any additional rules applicable to the files
being changed.

### Always-on

- [`.agents/rules/typescript-standards.mdc`](.agents/rules/typescript-standards.mdc) — TypeScript JSDoc, SOLID, and project structure skills for `apps/web`
- [`.agents/rules/agent-workflow.mdc`](.agents/rules/agent-workflow.mdc) — agent workflow, definition of done, and verification expectations

### Area-specific

- [`.agents/rules/reachability-mapbox.mdc`](.agents/rules/reachability-mapbox.mdc) — Reachability page and Mapbox invariants
- [`.agents/rules/biome-policy.mdc`](.agents/rules/biome-policy.mdc) — fix lint/format in source; no suppressions or overrides
- [`.agents/rules/vitest-policy.mdc`](.agents/rules/vitest-policy.mdc) — colocated tests; mock fetch/Mapbox; no live API in unit tests

## Skills

Canonical skills live under [`.agents/skills/`](.agents/skills/).

Read the matching skill before changing the corresponding area. Skills are
task-specific guidance and should not be loaded unless relevant.

- [`.agents/skills/reachability-web/`](.agents/skills/reachability-web/) — Vite SPA, Mapbox map, Reachability context, isochrone calculation, export
- [`.agents/skills/typescript-project-structure/`](.agents/skills/typescript-project-structure/) — React/TypeScript project and folder structure
- [`.agents/skills/typescript-solid-design/`](.agents/skills/typescript-solid-design/) — module boundaries, dependency direction, and dependency injection
- [`.agents/skills/typescript-jsdoc-style/`](.agents/skills/typescript-jsdoc-style/) — TypeScript documentation and comment conventions
- [`.agents/skills/vitest-reachability/`](.agents/skills/vitest-reachability/) — Vitest and Testing Library conventions for `apps/web`
- [`.agents/skills/react-doctor/`](.agents/skills/react-doctor/) — React Doctor scanning, interpretation, and triage
- [`.agents/skills/agent-verification/`](.agents/skills/agent-verification/) — when and how to run verification scripts

## Commands

Canonical slash commands live under [`.agents/commands/`](.agents/commands/).
The directory is symlinked from [`.cursor/commands`](.cursor/commands).

Prefer repository commands over manually recreating equivalent workflows.

- `/isochrone-verify` — local CI verification: `validate:skills`, Biome, test, build
- `/isochrone-doctor` — React Doctor scan and triage
- `/isochrone-skills-check` — run `validate:skills` and classify failures
- `/isochrone-fix-biome` — Biome CI fix loop without suppressions
- `/isochrone-implement-plan` — execute an attached plan with todos

## Hooks

Hook configuration lives in [`.cursor/hooks.json`](.cursor/hooks.json).

Hooks may auto-format after edit; they do not guarantee correctness. Always run
verification explicitly before claiming done.

- `sessionStart` — prompt reminding agents to read task routing and run `validate:skills`
- `afterFileEdit` → [`.agents/hooks/biome-after-file-edit.sh`](.agents/hooks/biome-after-file-edit.sh) — formats and lints edited files with Biome
- `afterFileEdit` → [`.agents/hooks/react-doctor-after-file-edit.sh`](.agents/hooks/react-doctor-after-file-edit.sh) — runs React Doctor on relevant web edits (advisory)

## Definition of done

A change is complete when:

1. Only intended files changed (review `git diff`).
2. Applicable rules and skills were followed for touched paths.
3. Narrow tests for touched paths passed (see table below).
4. `/isochrone-verify` or `pnpm verify` was run when the change is merge-ready, or you explicitly report what was skipped and why.
5. README, ARCHITECTURE, or DESIGN were updated if behavior, contracts, or UI tokens changed.

| Touched area | Minimum verification |
| ------------ | -------------------- |
| `apps/web/src` TypeScript | `pnpm validate:skills` |
| `apps/web` logic or UI | colocated Vitest for changed paths, or `pnpm test` |
| React UI structure / hooks | also `pnpm doctor:full` |
| Any merge-ready claim | `pnpm verify` |

- Do not claim a check passed unless it was actually run and passed.
- If verification cannot be completed, clearly state what was not run and why.
