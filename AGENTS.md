# Agent instructions

All TypeScript work in `apps/web/src` must follow these project skills:

- [typescript-jsdoc-style](.agents/skills/typescript-jsdoc-style/SKILL.md)
- [typescript-solid-design](.agents/skills/typescript-solid-design/SKILL.md)
- [typescript-project-structure](.agents/skills/typescript-project-structure/SKILL.md)

## Pre-merge checklist

### JSDoc

- [ ] JSDoc on exported functions, classes, interfaces, and constants
- [ ] Component summaries use third-person verb phrases (`Renders…`, `Returns…`)
- [ ] `@param`, `@returns`, and `@throws` only when they add information
- [ ] Multi-line ordinary comments use `//`, not `/* */`

### Project structure

- [ ] Components live in folder-per-component folders (`index.tsx`, `index.module.css`, `index.types.ts`)
- [ ] Page-only UI stays under `pages/<Page>/components/` until reused
- [ ] No component-layer barrels (`components/core/index.ts`, etc.)
- [ ] Pure helpers live in `utils/` or `pages/<Page>/utils/`, not beside components
- [ ] Service modules use `*-service.ts` naming

### SOLID

- [ ] High-level modules depend on port types in `types/`, not Mapbox adapters
- [ ] New behavior extends via interfaces/registries, not growing switches
- [ ] Context consumers use narrow hooks when possible

## Verification

```bash
pnpm validate:skills
pnpm exec biome ci .
pnpm test
pnpm build
```
