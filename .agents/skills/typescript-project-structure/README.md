# TypeScript Project Structure (Skill)

Agent skill for a **React + TypeScript** folder layout with **role-based
component layers**.

Use this skill when you create or review project structure. Use it when you
place components in core, patterns, containers, or layouts. Use it when you
choose a home for pages, hooks, contexts, services, and related files.

## When to use

- **Create or review** a React + TypeScript folder tree.
- **Keywords**: component layers, core, patterns, containers, layouts,
  folder-per-component, CSS Modules, barrel export, pages, hooks, contexts,
  services, stores.
- **Decisions**: which layer fits a component; shared vs page-local UI;
  where constants, types, utils, styles, assets, and i18n belong.

## What this skill covers

- **Role-based layers** — core, pattern, container, layout.
- **Folder-per-component** — `index.tsx`, `index.module.css`, `index.types.ts`.
- **Top-level `src/` folders** — assets, components, constants, pages,
  contexts, hooks, routes, services, stores, utils, styles, types, i18n.
- **Barrel exports and names** — stable imports and clear file names.

## Files

| File | Purpose |
|------|--------|
| [SKILL.md](SKILL.md) | Skill definition: rules, checklist, links (agent use) |
| [reference.md](reference.md) | Full `src/` tree, folder tables, naming rules |
| [examples.md](examples.md) | Code snippets for core, patterns, pages, hooks, services |

## See also

- Narrative and triggers: [SKILL.md](SKILL.md)
- Trees and tables: [reference.md](reference.md)
- Code snippets: [examples.md](examples.md)
