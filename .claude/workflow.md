# Workflow

How work moves through the repo. These rules apply with the same force as `CLAUDE.md`; the layering exists for organisation, not for softening.

## Scope Boundaries (ADR-035)

| Category | Paths | Rule |
|---|---|---|
| Modify freely | `src/`, `astro.config.mjs`, `tsconfig.json`, `biome.json`, `package.json`, `tokens/`, `public/`, `.github/workflows/` | Full read/write |
| Read-only | `docs/` | Don't modify unless explicitly asked to update documentation. Exception: you may add a new ADR file under `docs/adr/` with status Proposed, then run `pnpm adr:index` |
| Ask first | `CLAUDE.md`, `.claude/`, `checks/`, `scripts/src/enforcement-checks.ts`, `scripts/src/run-enforcement.ts`, `scripts/src/adr-guard.ts`, `scripts/src/adr-append-only.ts`, `scripts/src/stop-gate.ts`, existing ADRs | Governance files. Edit only with the maintainer's approval in the session; never edit one to make a request compliant (ADR-066) |
| Don't create | Maintenance artifacts, deployment workflows, marketing content | Suggest adding to docs site instead |

Full rationale in [ADR-035](../docs/adr/035-template-scope-boundary.md). The Ask-first row is backed by `permissions.ask` rules in `.claude/settings.json` ([ADR-066](../docs/adr/066-constitution-calibration.md)); a session with nobody to approve is refused, which is the intended outcome. Existing ADRs are backed by a PreToolUse hook, `scripts/src/adr-guard.ts`, which asks before any edit to a record that already exists and lets a new one through ([ADR-068](../docs/adr/068-adr-write-guard-and-append-only.md)).

## Three-pass Workflow, on request (ADR-038)

Use the three-pass workflow when the operator asks for it, for example by naming it or one of its roles. Otherwise work in one pass: constitution rule 10 still requires a failing test before production code, and rule 9 still requires `pnpm quality:ci` before calling the work done. For a feature that touches several ADRs, adds a dependency or changes a public API, say in your summary that the three-pass workflow is available.

When requested:

1. **Architect pass** ([`.claude/roles/architect.md`](roles/architect.md)) — write or update the relevant ADR; write the failing test scaffold; no production code
2. **Coder pass** ([`.claude/roles/coder.md`](roles/coder.md)) — minimum implementation to make the failing test pass; no test edits beyond what the Architect scaffolded
3. **Reviewer pass** ([`.claude/roles/reviewer.md`](roles/reviewer.md)) — run `pnpm quality:ci`; report delta vs. the Architect plan; recommend (no commits)

Each pass produces a concrete artefact and announces hand-off explicitly. The operator (human) enforces the hand-off: refuse to merge requested work that skipped a pass.

Full rationale in [ADR-038](../docs/adr/038-agent-roles.md).

## Quality Gate (ADR-039)

Before claiming a change is complete, run:

```bash
pnpm quality:ci
```

If it exits non-zero, halt and fix the failure. Do not propose the change as complete. Do not work around the failure by lowering thresholds, excluding files, or skipping git hooks with `--no-verify`.

**Local↔CI parity** (per [ADR-039](../docs/adr/039-halt-on-violation-enforcement.md)): `pnpm quality:ci` runs `format:check + lint + lint:md + check + test:unit`, then the repo-consistency gates `agents:check` ([ADR-045](../docs/adr/045-cross-tool-agents-spine.md)), `version:check`, `og:check`, `adr:check`, `docs:count` and `docs:snippets`, then `enforce`, the ADR enforcement suite ([ADR-064](../docs/adr/064-enforcement-architecture.md)), which fails on any block-status check. CI runs the same plus `test:coverage` (for the artefact upload added in PR #213). Same tests; only v8 instrumentation differs. A broken unit test fails both commands.

A Stop hook, `scripts/src/stop-gate.ts`, runs `pnpm test:unit` and `pnpm enforce` when you finish a turn ([ADR-069](../docs/adr/069-stop-gate-hook.md)). If it blocks, fix the failure; do not edit a test, a check or its status to get past it. If you cannot fix it, start your final message with `GATE FAILING:` and say what is failing and what you need. The hook is not the gate: `pnpm quality:ci` still is.

The fast inner-loop variant is `pnpm quality` (auto-fixes format and lint where possible; does NOT chain tests, so iteration stays fast). Reserve `pnpm quality:ci` for the final gate before claiming done.

## ADR Discipline

- Check `docs/adr/` before proposing architectural changes
- Every Accepted ADR is a constraint — if the request conflicts, halt and report it. Revise the proposal, or draft a new Proposed ADR that would supersede the record; do not edit the Accepted ADR, its check, or a rule to remove the conflict
- If a decision should be an ADR (e.g. you're picking a tool, library, pattern, or convention), say so — don't make architectural calls inline
- Accepted ADRs are append-only ([ADR-068](../docs/adr/068-adr-write-guard-and-append-only.md)): an amendment appends a dated note, changes the Status line, or fills the graduation log; a decision that no longer holds is superseded by a new record. `adr-append-only` reports accepted text that was removed or rewritten
- ADR template: `docs/adr/template.md`
- ADR numbering is sequential; check the highest existing number before creating a new one
- A new ADR starts as Proposed, keeps the template's not-enforced Enforcement stub, and is added to the index with `pnpm adr:index`. Only the maintainer moves a record to Accepted

## Git Hooks

- **Pre-commit**: `lint-staged` runs Biome check on staged files
- **Pre-push**: `pnpm test:unit` (push is blocked if any unit test fails; never bypass with `--no-verify` — fix the failure, per constitution rule 9)
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

### Gherkin / BDD-style specs — declined

The Phase 2 testing plan reserved an optional slot (ADR-041) for Gherkin-style `*.feature` files consumed by Playwright if the E2E restructure surfaced cases where prose acceptance criteria were genuinely ambiguous.

The restructure (PR for `e2e/index.spec.ts`) did not surface any such case. The split-out tests (one logical assertion per test, behaviour-describing names per ADR-037) already read as specifications. Adding Given/When/Then on top would be ceremony without signal.

**Decision: do not open ADR-041 at this time.** If a future feature genuinely has Given/When/Then-shaped acceptance criteria (contact form happy/sad paths, future search, multi-step flow), revisit by opening ADR-041 then. The trigger condition is "prose acceptance criteria are ambiguous enough that test reviewers disagree about whether the test matches the spec." Until that trigger fires, the existing tests-as-specs convention stands.
