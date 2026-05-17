# Workflow

How work moves through the repo. These rules apply with the same force as `CLAUDE.md`; the layering exists for organisation, not for softening.

## Scope Boundaries (ADR-035)

| Category | Paths | Rule |
|---|---|---|
| Modify freely | `src/`, `astro.config.mjs`, `tsconfig.json`, `biome.json`, `package.json`, `tokens/`, `public/`, `.github/workflows/`, `.windsurfrules` | Full read/write |
| Read-only | `docs/` | Don't modify unless explicitly asked to update documentation |
| Don't create | Maintenance artifacts, deployment workflows, marketing content | Suggest adding to docs site instead |

Full rationale in [ADR-035](../docs/adr/035-template-scope-boundary.md).

## Non-trivial Feature Workflow (ADR-038)

For any feature that touches multiple ADRs, has non-obvious acceptance criteria, adds a dependency, or changes a public API, use the three-pass workflow:

1. **Architect pass** ([`.claude/roles/architect.md`](roles/architect.md)) — write or update the relevant ADR; write the failing test scaffold; no production code
2. **Coder pass** ([`.claude/roles/coder.md`](roles/coder.md)) — minimum implementation to make the failing test pass; no test edits beyond what the Architect scaffolded
3. **Reviewer pass** ([`.claude/roles/reviewer.md`](roles/reviewer.md)) — run `pnpm quality:ci`; report delta vs. the Architect plan; recommend (no commits)

Each pass produces a concrete artefact and announces hand-off explicitly. The operator (human) enforces the hand-off: refuse to merge work that skipped a pass. Trivial changes (typo, single-line, single rename) can skip the pattern.

Full rationale in [ADR-038](../docs/adr/038-agent-roles.md).

## Quality Gate

Before claiming a change is complete, run:

```bash
pnpm quality:ci
```

If it exits non-zero, halt and fix the failure. Do not propose the change as complete. Do not work around the failure by lowering thresholds or excluding files.

Local-vs-CI parity: `pnpm quality:ci` runs `format:check + lint + lint:md + check`. CI runs the same plus `test:coverage` (for the artifact upload). Locally, you can run `pnpm test:unit` (faster, no instrumentation) or `pnpm test:coverage` (with v8 coverage report).

## ADR Discipline

- Check `docs/adr/` before proposing architectural changes
- Every Accepted ADR is a constraint — if your proposal conflicts, halt and either revise the proposal or update the ADR
- If a decision should be an ADR (e.g. you're picking a tool, library, pattern, or convention), say so — don't make architectural calls inline
- ADR template: `docs/adr/template.md`
- ADR numbering is sequential; check the highest existing number before creating a new one

## Git Hooks

- **Pre-commit**: `lint-staged` runs Biome check on staged files
- **Pre-push**: `pnpm test:unit` (push is blocked if any unit test fails; use `--no-verify` only with explicit justification)
- **Commit-msg**: `commitlint` enforces conventional commit format

Branch naming: `feature/*`, `fix/*`, `docs/*`, `chore/*`, `phase{N}/*` for phased plan execution.

## Testing Requirements

| Layer | Tooling | Pattern | Location |
|---|---|---|---|
| Utilities, pure functions | Vitest | `src/utils/__tests__/*.test.ts` | Required for every new util |
| Components | Vitest + Astro Container API | `src/components/**/__tests__/*.test.ts` | Required for new atoms/molecules |
| Pages, cross-component flows | Playwright | `e2e/*.spec.ts` | Required for new pages |
| Accessibility | `@axe-core/playwright` | Tag tests `@a11y` | Cross-cutting |
| Performance | Lighthouse CI, JS bundle gate | Budgets in `.claude/stack.md` | Enforced in CI |

For coverage targets, see [ADR-023](../docs/adr/023-testing-strategy.md).
