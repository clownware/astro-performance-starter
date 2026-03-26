---
title: Phase 3 - Essential Tooling & Quality Gates
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Details linting setup, formatting configuration, CI pipeline, and quality
  gates — Foundation tier, essential for all projects
tableOfContents: true
pagefind: true
---
<Badge variant="success">Done</Badge>

## Overview

- **Tier**: Foundation (Phase 3 of 12)
- **Duration**: 1 day
- **Dependencies**: Phase 0-2 completed
- **Deliverables**: Linting setup, formatting config, CI pipeline, quality gates

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

Our pre-commit hooks will automatically:

- Format your code with Biome
- Sort Tailwind classes
- Validate TypeScript types

### Manual Checks

Run all quality checks:

```bash
pnpm run quality
```

*Note: As the project grows, the full `pnpm run quality` suite (including tests, extensive linting, etc.) might become slower. For faster local iteration, a mechanism such as setting an environment variable (e.g., `CI=0` or `FAST_LINT=true`) might be implemented to run a quicker, focused subset of these checks. However, the complete quality suite will always be enforced by pre-commit hooks and the CI pipeline to ensure no regressions.*

Individual checks:

- `pnpm run lint` - Check for code issues
- `pnpm run format:check` - Verify formatting
- `pnpm run check` - Type checking

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

### Performance Budget

Respect our performance budgets:

- JS Bundle: < 160KB
- CSS Bundle: < 50KB
- Images: < 200KB each

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

3. **Token Drift**: Forgetting to commit built tokens
   - **Solution**: CI validates token builds

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
- [ ] VSCode settings configured
- [ ] Contributing guide written

## Rollback Strategy

If tooling causes issues:

1. **Biome Problems**:

    ```bash
       # Temporarily disable
       mv biome.json biome.json.backup
       # Use basic prettier config
       echo '{"semi": true}' > .prettierrc
    ```

2. **CI Failures**:

    ```text
      - Check for flaky tests
      - Increase timeouts if needed
      - Review recent dependency updates
    ```

3. **Hook Issues**:

    ```bash
       # Bypass hooks temporarily
       git commit --no-verify
       # Fix and re-enable
    ```

## AI Assistant Notes

### Key Files to Reference

- `biome.json` - Linting and formatting rules
- `.github/workflows/ci.yml` - CI pipeline
- `package.json` - Scripts and hooks
- `.vscode/settings.json` - Editor config

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
