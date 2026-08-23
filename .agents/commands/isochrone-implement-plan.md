# Isochrone implement plan

Execute an attached implementation plan. Do not edit the plan file itself.

## Steps

1. Read the attached plan and existing todos.
2. Mark the first todo `in_progress`; do not recreate todos.
3. Implement each todo in order; mark `completed` as you finish.
4. Run narrow tests for touched paths.
5. Run `/isochrone-verify` or `pnpm verify` before claiming done.
6. Add `pnpm doctor:full` if React structure changed.

## Rules

- Smallest correct diff; no unrelated refactors.
- Read the skill from AGENTS.md task routing before editing each area.
- Do not commit unless the user asks.

## Output

Summarize what was implemented and verification results.
