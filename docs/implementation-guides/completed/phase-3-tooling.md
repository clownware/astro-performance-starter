---
title: Phase 3 - Essential Tooling & Quality Gates
description: >-
  Details linting setup, formatting configuration, CI pipeline, and quality
  gates — Foundation tier, essential for all projects
lastUpdated: true
tableOfContents: true
pagefind: true
---
<Badge variant="success">Done</Badge>

## Overview

- **Tier**: Foundation (Phase 3 of 12)
- **Scope**: Essential, with one Recommended step (scope labels follow [ADR-033](/adr/033-track-consolidation/))
- **Duration**: 1 day
- **Dependencies**: Phase 0-2 completed
- **Deliverables**: Linting setup, formatting config, CI pipeline, quality gates
- **Code examples**: [Phase 3 - Code Examples](/implementation-guides/completed/phase-3-code-examples/)

## Entry Criteria

- [x] TypeScript configured
- [x] Design system initialized
- [x] Git repository set up
- [x] Package manager chosen

## Implementation Steps

| Step | Task | Scope | Notes |
|------|------|-------|-------|
| 3.01 | Install Biome | Essential | Replaces ESLint + Prettier |
| 3.02 | Configure Biome rules | Essential | Astro-friendly settings |
| 3.03 | Set up format command | Essential | Format on save |
| 3.04 | Configure lint command | Essential | Type-aware linting |
| 3.05 | Set up pre-commit hook | Essential | Husky + lint-staged |
| 3.06 | Set up commit-msg hook | Essential | Husky + commitlint |
| 3.07 | Create CI workflow | Essential | GitHub Actions |
| 3.08 | Add type checking | Essential | tsc + astro check |
| 3.09 | Configure build checks | Essential | Token validation (script to check all semantic color token pairs for WCAG AA contrast) |
| 3.10 | Set up branch protection | Essential | Require CI pass |
| 3.11 | Add dependency audit | Essential | Security scanning |
| 3.12 | Set up unit testing for utilities | Essential | Vitest for core helpers/utils |
| 3.13 | Create quality reports (e.g., coverage) | Recommended | Broader test coverage, complexity reports |
| 3.14 | Document standards | Essential | Contributing guide |

### Why Biome over ESLint + Prettier?

This project uses Biome as its primary tool for code formatting and linting, replacing the more traditional combination of ESLint and Prettier. Here’s why:

- **Performance**: Biome is written in Rust and is designed to be extremely fast—often over 20x faster than ESLint. This keeps the development feedback loop quick, especially in large codebases.
- **Simplicity**: By combining formatting and linting into a single tool, Biome reduces configuration overhead. There's only one configuration file (`biome.json`) and one dependency to manage.
- **All-in-One Solution**: Biome handles formatting, linting, and import sorting out of the box, eliminating the need for separate plugins and tools to make them work together.
- **First-Class TypeScript Support**: It's built with TypeScript in mind, providing robust and accurate type-aware linting.

## Code Quality Standards

### Before Committing

Our pre-commit hook runs `lint-staged`, which automatically:

- Runs `biome check --write` on staged code files (format, lint, import sorting)
- Runs `markdownlint-cli2 --fix` on staged Markdown files

The commit-msg hook runs `commitlint`, and the pre-push hook runs the unit tests (`pnpm run test:unit`). Type checking is not part of the hooks — `tsc` and `astro check` run via `pnpm run quality` locally and `quality:ci` in CI.

### Manual Checks

Run all quality checks:

```bash
pnpm run quality
```

The canonical gate — the same command CI runs, and the one a change must pass before it can be called complete — is:

```bash
pnpm run quality:ci
```

_Note: As the project grows, the full `pnpm run quality` suite (including tests, extensive linting, etc.) might become slower. For faster local iteration, a mechanism such as setting an environment variable (e.g., `CI=0` or `FAST_LINT=true`) might be implemented to run a quicker, focused subset of these checks. However, the complete quality suite will always be enforced by the CI pipeline (the git hooks run a faster subset: lint-staged pre-commit, unit tests pre-push) to ensure no regressions._

Individual checks:

- `pnpm run lint` - Check for code issues
- `pnpm run format:check` - Verify formatting
- `pnpm run check` - Type checking

`quality:ci` chains these plus markdown linting, unit tests, and the repo's consistency gates — treat it as the single source of truth for "is this change done".

### Code Style

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use optional chaining (`?.`)
- Sort imports alphabetically
- Keep files under 300 lines

### Component Guidelines

- One component per file
- Props interface exported
- JSDoc comments for public APIs
- Accessibility considered

### Git Workflow

1. Create feature branch
2. Make changes
3. Commit with conventional format:
   - `feat:` New features
   - `fix:` Bug fixes
   - `docs:` Documentation
   - `style:` Formatting
   - `refactor:` Code restructuring
   - `perf:` Performance
   - `test:` Testing
   - `chore:` Maintenance

4. Push and create PR
5. Ensure CI passes

### Performance Budgets

CI enforces these raw (uncompressed) budgets on every push — see `.github/workflows/ci.yml`; the sizes live in `budgets.json` and are applied by `pnpm run perf:budgets` together with any unexpired `budget-overrides.json` entries:

- **JavaScript**: 160KB total (also checked by the inline "Enforce JS bundle size budget" step), 64KB per file
- **Fonts**: 150KB total, 64KB per file
- **Images**: 200KB per file (`budgets.json`, plus the source and build-output image gate `pnpm run images:gate` — [ADR-057](/adr/057-image-budget-gate/))
- **Font preloads**: at most 2 per page (`pnpm run fonts:gate` — [ADR-058](/adr/058-font-preload-budget/))

CSS has **no enforced size budget** — the 50KB figure quoted elsewhere is advisory (tracked, not CI-gated; see the `$comment` in `budgets.json`). Lighthouse category floors are gated by the separate `lighthouse.yml` workflow. Full targets: [Performance Budgets & Quality Guardrails](/implementation-guides/reference/budgets-guardrails/).

### Accessibility

- WCAG AA compliance minimum
- Test with keyboard navigation
- Verify with screen readers
- Check color contrast

## Common Pitfalls

1. **Conflicting Formatters**: Having Prettier and Biome both active
   - **Solution**: Disable Prettier, use only Biome

2. **Slow CI**: Running unnecessary checks
   - **Solution**: Parallelize jobs, cache dependencies

3. **Token Drift**: Hand-editing generated files — `tokens/dist/` is gitignored and rebuilt by `predev` and `build`
   - **Solution**: Edit `tokens/*.json` only; `pnpm run tokens:build` regenerates `tokens/dist/` (CI's `build` step does the same), and `design:validate` gates the source tokens for WCAG AA contrast

4. **Type Errors Hidden**: Not running strict checks
   - **Solution**: Both `tsc` and `astro check` in CI

## Exit Criteria

- [ ] Biome installed and configured
- [ ] Format/lint commands working
- [ ] Pre-commit hooks functional
- [ ] CI pipeline passing
- [ ] Type checking enabled
- [ ] Token validation in CI
- [ ] Branch protection enabled
- [ ] Security scanning active
- [ ] Contributing guide written

## Rollback Strategy

If tooling causes issues:

1. **Biome Problems**:

    ```bash
       # Revert to the last known-good Biome config — Biome is the only
       # formatter/linter in this stack; do not fall back to Prettier or ESLint
       git checkout HEAD~1 -- biome.json
    ```

2. **CI Failures**:

    ```text
      - Check for flaky tests
      - Increase timeouts if needed
      - Review recent dependency updates
    ```

3. **Hook Issues**:

    Do not bypass the pre-commit or commit-msg hooks with `--no-verify` — the gates are halt-on-violation by design ([ADR-039](/adr/039-halt-on-violation-enforcement/)). Fix the underlying failure (or revert the change that introduced it) so the hook passes, then commit. The pre-push hook's own header allows `--no-verify` only for a deliberate WIP backup push.

## AI Assistant Notes

### Key Files to Reference

- `biome.json` - Linting and formatting rules
- `.github/workflows/ci.yml` - CI pipeline
- `package.json` - Scripts and hooks (`lint-staged` config lives here)
- `.husky/` - Pre-commit, commit-msg, and pre-push hooks
- `.commitlintrc.cjs` - Conventional commit rules
- `budgets.json` - Enforced raw-size budgets

### Common Prompts for This Phase

- "Set up Biome for Astro project"
- "Create GitHub Actions CI for quality checks"
- "Configure pre-commit hooks with Husky"
- "Add security scanning to CI"

### Context Requirements

- Team size and experience
- CI/CD platform (GitHub Actions, etc.)
- Performance requirements
- Security compliance needs
