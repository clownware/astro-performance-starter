---
title: Phase 0 - Foundation Decisions
description: >-
  Covers core architecture decisions, repository setup, and development
  environment — Foundation tier, essential for all projects
lastUpdated: true
tableOfContents: true
pagefind: true
---
<Badge variant="success">Done</Badge>

## Overview

- **Tier**: Foundation (Phase 0 of 12)
- **Scope**: Essential — every project completes this phase (scope labels follow [ADR-033](/adr/033-track-consolidation/))
- **Effort**: Minimal, foundational setup
- **Dependencies**: None
- **Deliverables**: Core architecture decisions, repository setup, development environment

## Entry Criteria

- [x] Project requirements defined
- [x] Hosting platform chosen
- [x] Team assembled (if applicable)
- [x] Development machines ready

## Implementation Steps

| Step | Task | Scope | Notes |
|------|------|-------|-------|
| 0.01 | Initialize repository | Essential | Include .gitignore, README |
| 0.02 | Choose package manager | Essential | pnpm recommended for speed |
| 0.03 | Set up Node.js version | Essential | `.nvmrc` pinned to the Node release listed in `versions.json` |
| 0.04 | Select framework version | Essential | Current stable Astro release (see `versions.json`) |
| 0.05 | Configure TypeScript | Essential | Strict mode from start |
| 0.05a | Configure Biome (lint/format) | Essential | Init @biomejs/biome & VSCode extension |
| 0.06 | Initialize Astro project | Essential | Use create-astro CLI |
| 0.07 | Set up Git hooks | Essential | Husky + lint-staged |
| 0.08 | Create branch strategy | Essential | Document in README |
| 0.09 | Configure environment vars | Essential | .env.example template |
| 0.10 | Create ADR structure | Essential | docs/adr/template.md |
| 0.11 | Document key decisions | Essential | First ADR entry |

## Code Examples

### Initialize Project

```bash
# Create project with pnpm
pnpm create astro@latest my-portfolio -- \
  --template minimal \
  --typescript strict \
  --git \
  --no-install

cd my-portfolio
pnpm install
```

### Package Manager Configuration

```json
// package.json — copy the exact pins from the starter's versions.json:
//   packageManager ← "pnpm", engines.node ← "node-minimum"
{
  "packageManager": "pnpm@<version>",
  "engines": {
    "node": ">=<node-minimum>",
    "pnpm": ">=<pnpm major>"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "SITE_URL=${SITE_URL:-http://localhost:4321} astro check",
    "check:types": "tsc --noEmit",
    "format": "biome format . --write",
    "lint": "biome check ."
  }
}
```

Astro and TypeScript checking are split into separate scripts (`check` and `check:types`), and `lint` is check-only — autofixing happens via lint-staged in the pre-commit hook, not in the `lint` script itself. The `build` script grows `env:validate` and `tokens:build` prefixes in later phases; the full everyday script set is in the [Phase 3 code examples](/implementation-guides/completed/phase-3-code-examples/).

### Biome Configuration

{% snippet "biome-config" %}

### Editor Configuration

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

### Node Version File

```bash
# .nvmrc — copy the exact value from the starter's .nvmrc
# (it matches the "node" entry in versions.json)
<node version>
```

### TypeScript Configuration

{% snippet "tsconfig-paths" %}

### Git Hooks Setup

{% snippet "git-hooks" %}

{% snippet "lint-staged-config" %}

### Environment Variables Template

{% snippet "env-example" %}

### First Architecture Decision Record

{% snippet "adr-template" %}

### Branch Strategy Documentation

```markdown
# docs/development/git-workflow.md

## Branch Strategy

### Main Branches
- `master` - Production-ready code (the starter's single long-lived branch; use `main` in your own fork if you prefer)
- `develop` - Integration branch (optional, for team projects — the starter itself has none)

### Feature Branches
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `chore/*` - Maintenance and tooling

### Workflow
1. Create feature branch from the default branch
2. Make changes with conventional commits
3. Run `pnpm run quality:ci` before opening a PR
4. Open PR with description
5. Squash-merge after review (team projects) or self-merge (solo)

### Commit Convention
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `perf:` - Performance improvement
- `test:` - Testing
- `chore:` - Maintenance
```

## Common Pitfalls

1. **Wrong Package Manager**: Mixing npm/yarn/pnpm causes lockfile conflicts
   - **Solution**: Pin `packageManager` and `engines` in `package.json` (as the starter does) and commit only `pnpm-lock.yaml`; an `.npmrc` with `engine-strict=true` makes the engine range fail fast

2. **Loose TypeScript**: Starting without strict mode makes it hard to enable later
   - **Solution**: Always start with strict mode, add `// @ts-expect-error` sparingly

3. **Missing Git Hooks**: Code quality degrades without automation
   - **Solution**: Set up hooks before writing code

4. **Environment Variable Confusion**: Hardcoded values in code
   - **Solution**: Use `.env.example` and validate on startup

## Exit Criteria

- [x] Repository initialized with correct .gitignore
- [x] Package manager locked (pnpm-lock.yaml committed)
- [x] Node.js version specified (.nvmrc file)
- [x] TypeScript in strict mode
- [x] Git hooks functioning (test with commit)
- [x] Branch strategy documented
- [x] Environment variables structured
- [x] ADR template and first decision recorded
- [x] README has basic project information

## Rollback Strategy

If critical issues found after Phase 0:

1. **Package Manager Issues**:

   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

2. **Git Configuration Issues**:

   ```bash
   rm -rf .git
   git init
   # Re-apply configuration
   ```

3. **Framework Version Issues**:
   - Update package.json to stable version
   - Clear cache: `pnpm store prune`
   - Reinstall dependencies

## AI Assistant Notes

### Key Files to Reference

- `package.json` - Verify scripts and dependencies
- `tsconfig.json` - TypeScript configuration
- `.husky/pre-commit` - Git hooks
- [ADR-000: Starter Decisions](/adr/000-starter-decisions/) - Key decisions

### Common Prompts for This Phase

- "Set up an Astro project on the current stable release with TypeScript strict mode"
- "Configure Biome for Astro project"
- "Create Git hooks for code quality"
- "Write ADR for foundation decisions"

### Context Requirements

- Project type (portfolio, blog, marketing)
- Team size (solo vs team)
- Deployment target (Cloudflare Pages, Vercel, etc.)
