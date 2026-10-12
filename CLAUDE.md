# Constitution — Astro Performance Starter

These rules apply with halt-on-violation force. If a rule fires and you cannot satisfy it, halt and report the conflict — do not work around it.

## Rules

1. Architectural changes require checking `docs/adr/` first. If an Accepted ADR contradicts the request, halt and report the conflict. Do not edit the ADR, its check, or a rule to remove the conflict; the maintainer amends or supersedes the record (ADR-066).
2. `client:load` is forbidden without ADR justification (ADR-001). Use `client:idle` or `client:visible`. If neither works, halt and open an ADR.
3. Hardcoded colour or spacing values are forbidden. Use design tokens from `tokens/`. If a token is missing, halt and add it.
4. TypeScript strict mode is mandatory. Do not disable strict checks to make types pass — fix the types.
5. Linting and formatting use Biome. Do not introduce ESLint or Prettier.
6. The package manager is pnpm. Do not use npm or yarn commands.
7. Prefer CSS solutions over JavaScript. Behaviour CSS cannot provide uses the smallest targeted script in the component, with no framework island; name it in your summary. A hydrated island or a new client-side dependency requires ADR justification (ADR-001).
8. Images use the Astro Image component. Raw `<img>` is forbidden outside the two exemptions recorded in ADR-030 (the wrapper's string-src fallback; unrasterisable SVGs with an inline justifying comment).
9. Before claiming a change is complete, run `pnpm quality:ci`. If it exits non-zero, halt and fix the failure. Do not propose the change as complete. Script names are a contract: renaming or removing one is forbidden (ADR-052).
10. Production code follows a failing test. If you generate production code without a corresponding failing test, halt and write the test (ADR-037).

## Precedence

Rules in [`.claude/engineering.md`](.claude/engineering.md) and [`.claude/workflow.md`](.claude/workflow.md) apply with constitutional force; the layering exists for organisation, not for softening. Stack facts (commands, versions, dependencies) live in [`.claude/stack.md`](.claude/stack.md). Scope boundaries are defined in [ADR-035](docs/adr/035-template-scope-boundary.md); the layering itself is established by [ADR-036](docs/adr/036-layered-constitution.md).
