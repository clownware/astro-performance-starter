---
title: 'Phase 0: Foundation Decisions'
version: 1.0.0
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Covers core architecture decisions, repository setup, and development
  environment for both MVP and Showcase tracks.
---
## Overview
- **Track**: Both (MVP & Showcase)
- **Duration**: 1 day
- **Dependencies**: None
- **Deliverables**: Core architecture decisions, repository setup, development environment

## Entry Criteria
- [x] Project requirements defined
- [x] Hosting platform chosen
- [x] Team assembled (if applicable)
- [x] Development machines ready

## Implementation Steps

| Step | Task | MVP | Showcase | Notes |
|------|------|-----|----------|-------|
| 0.01 | Initialize repository | ✅ | ✅ | Include .gitignore, README |
| 0.02 | Choose package manager | ✅ | ✅ | pnpm recommended for speed |
| 0.03 | Set up Node.js version | ✅ | ✅ | Use .nvmrc with Node {{versions.node-current}} LTS |
| 0.04 | Select framework version | ✅ | ✅ | Astro {{versions.astro}} stable |
| 0.05 | Configure TypeScript | ✅ | ✅ | Strict mode from start |
| 0.05a | Configure Biome (lint/format) | ✅ | ✅ | Init @biomejs/biome & VSCode extension |
| 0.06 | Initialize Astro project | ✅ | ✅ | Use create-astro CLI |
| 0.07 | Set up Git hooks | ✅ | ✅ | Husky + lint-staged |
| 0.08 | Create branch strategy | ✅ | ✅ | Document in README |
| 0.09 | Configure environment vars | ✅ | ✅ | .env.example template |
| 0.10 | Create ADR structure | ✅ | ✅ | docs/adr/template.md |
| 0.11 | Document key decisions | ✅ | ✅ | First ADR entry |

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
// package.json
{
  "packageManager": "pnpm@9.15.0",
  "engines": {
    "node": ">=22.0.0",
    "pnpm": ">=9.0.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check && tsc --noEmit",
    "format": "biome format --write .",
    "lint": "biome check --write ."
  }
}
```

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
# .nvmrc
{{versions.node}}
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
# docs/git-workflow.md

## Branch Strategy

### Main Branches
- `main` - Production-ready code
- `develop` - Integration branch (Showcase only)

### Feature Branches
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Workflow
1. Create feature branch from main
2. Make changes with conventional commits
3. Open PR with description
4. Merge after review (Showcase) or self-merge (MVP)

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
   - **Solution**: Commit `.npmrc` with `engine-strict=true`

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
- `docs/adr/001-foundation.md` - Key decisions

### Common Prompts for This Phase
- "Set up Astro {{versions.astro}} project with TypeScript strict mode"
- "Configure Biome for Astro project"
- "Create Git hooks for code quality"
- "Write ADR for foundation decisions"

### Context Requirements
- Project type (portfolio, blog, marketing)
- Team size (solo vs team)
- Deployment target (Cloudflare Pages, Vercel, etc.)
