# Constitution — Astro Performance Starter

These rules apply with halt-on-violation force. If a rule fires and you cannot satisfy it, halt and report the conflict — do not work around it.

## Rules

1. Architectural changes require checking `docs/adr/` first. If an Accepted ADR contradicts your proposal, halt and update the ADR or revise the proposal.
2. `client:load` is forbidden without ADR justification (ADR-001). Use `client:idle` or `client:visible`. If neither works, halt and open an ADR.
3. Hardcoded colour or spacing values are forbidden. Use design tokens from `tokens/`. If a token is missing, halt and add it.
4. TypeScript strict mode is mandatory. Do not disable strict checks to make types pass — fix the types.
5. Linting and formatting use Biome. Do not introduce ESLint or Prettier.
6. The package manager is pnpm. Do not use npm or yarn commands.
7. Prefer CSS solutions over JavaScript. JS for static behaviour requires ADR justification.
8. Images use the Astro Image component. Raw `<img>` tags are forbidden.
9. Before claiming a change is complete, run `pnpm quality:ci`. If it exits non-zero, halt and fix the failure. Do not propose the change as complete.

## Precedence

Rules in [`.claude/engineering.md`](.claude/engineering.md) and [`.claude/workflow.md`](.claude/workflow.md) apply with constitutional force; the layering exists for organisation, not for softening. Stack facts (commands, versions, dependencies) live in [`.claude/stack.md`](.claude/stack.md). Scope boundaries are defined in [ADR-035](docs/adr/035-template-scope-boundary.md); the layering itself is established by [ADR-036](docs/adr/036-layered-constitution.md).
