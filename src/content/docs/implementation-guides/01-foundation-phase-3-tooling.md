---
title: Phase 3 - Essential Tooling & Quality Gates
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Details linting setup, formatting configuration, CI pipeline, and quality
  gates for both tracks
tableOfContents: true
pagefind: true
---
<Badge variant="success">Done</Badge>

## Overview

- **Track**: Both (MVP & Showcase)
- **Duration**: 1 day
- **Dependencies**: Phase 0-2 completed
- **Deliverables**: Linting setup, formatting config, CI pipeline, quality gates

## Entry Criteria

- [x] TypeScript configured
- [x] Design system initialized
- [x] Git repository set up
- [x] Package manager chosen

## Implementation Steps

| Step | Task | MVP | Showcase | Notes |
|------|------|-----|----------|-------|
| 3.01 | Install Biome | ✅ | ✅ | Replaces ESLint + Prettier |
| 3.02 | Configure Biome rules | ✅ | ✅ | Astro-friendly settings |
| 3.03 | Set up format command | ✅ | ✅ | Format on save |
| 3.04 | Configure lint command | ✅ | ✅ | Type-aware linting |
| 3.05 | Set up pre-commit hook | ✅ | ✅ | Husky + lint-staged |
| 3.06 | Set up commit-msg hook | ✅ | ✅ | Husky + commitlint |
| 3.07 | Create CI workflow | ✅ | ✅ | GitHub Actions |
| 3.08 | Add type checking | ✅ | ✅ | tsc + astro check |
| 3.09 | Configure build checks | ✅ | ✅ | Token validation (script to check all semantic color token pairs for WCAG AA contrast) |
| 3.10 | Set up branch protection | ✅ | ✅ | Require CI pass |
| 3.11 | Add dependency audit                     | ✅ | ✅ | Security scanning                         |
| 3.12 | Set up unit testing for utilities        | ✅ | ✅ | Vitest for core helpers/utils             |
| 3.13 | Create quality reports (e.g., coverage)  | ❌ | ✅ | Broader test coverage, complexity reports |
| 3.14 | Document standards                       | ✅ | ✅ | Contributing guide                        |

### Why Biome over ESLint + Prettier?

This project uses Biome as its primary tool for code formatting and linting, replacing the more traditional combination of ESLint and Prettier. Here’s why:

- **Performance**: Biome is written in Rust and is designed to be extremely fast—often over 20x faster than ESLint. This keeps the development feedback loop quick, especially in large codebases.
- **Simplicity**: By combining formatting and linting into a single tool, Biome reduces configuration overhead. There's only one configuration file (`biome.json`) and one dependency to manage.
- **All-in-One Solution**: Biome handles formatting, linting, and import sorting out of the box, eliminating the need for separate plugins and tools to make them work together.
- **First-Class TypeScript Support**: It's built with TypeScript in mind, providing robust and accurate type-aware linting.

## Code Examples

### Biome Configuration

{% snippet "biome-config" %}

**Key Benefits of This Configuration:**

### Husky & Commitlint Configuration

{% snippet "commitlint-config" %}

{% snippet "git-hooks" %}

### Updated Package Scripts

{% snippet "package-scripts" %}

> **Note on Local vs. CI Scripts**: The `quality` script is designed for fast local checks. The `quality:ci` script includes heavier tasks like end-to-end testing and should be run in the CI environment. You can use an environment variable like `CI=true` in your CI workflow to run the appropriate script.

### Lint-staged Configuration

{% snippet "lint-staged-config" %}

### GitHub Actions CI Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

env:
  NODE_VERSION: '22'
  PNPM_VERSION: '9'

jobs:
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup PNPM
        uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}
          
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build tokens
        run: pnpm run build:tokens # Note: The './scripts/build-tokens.js' file, executed by this command, will need to be created.
        
      - name: Check token changes
        run: |
          if [[ -n $(git status --porcelain tokens/dist) ]]; then
            echo "❌ Uncommitted token changes detected"
            echo "Run 'pnpm run build:tokens' and commit the changes"
            exit 1
          fi
          
      - name: Lint code
        run: pnpm run lint
        
      - name: Check formatting
        run: pnpm run format:check
        
      - name: Type check
        run: pnpm run check:types
        
      - name: Astro check
        run: pnpm run check:astro
        
      - name: Validate contrast
        run: pnpm run validate:contrast

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: quality
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup PNPM
        uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}
          
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build site
        run: pnpm run build
        
      - name: Check bundle size
        run: |
          # Load any budget overrides
          OVERRIDES_FILE="budget-overrides.json"
          JS_BUDGET=163840
          CSS_BUDGET=51200
          
          # Check if overrides exist and are not expired
          if [ -f "$OVERRIDES_FILE" ]; then
            CURRENT_DATE=$(date +%Y-%m-%d)
            
            # Check for JS override
            JS_OVERRIDE=$(jq -r --arg date "$CURRENT_DATE" '.overrides[] | select(.metric == "javascript-size" and .expires > $date) | .temporary' $OVERRIDES_FILE)
            if [ ! -z "$JS_OVERRIDE" ]; then
              JS_BUDGET=$JS_OVERRIDE
              echo "⚠️  Using temporary JS budget override: $JS_BUDGET bytes"
            fi
            
            # Check for CSS override
            CSS_OVERRIDE=$(jq -r --arg date "$CURRENT_DATE" '.overrides[] | select(.metric == "css-size" and .expires > $date) | .temporary' $OVERRIDES_FILE)
            if [ ! -z "$CSS_OVERRIDE" ]; then
              CSS_BUDGET=$CSS_OVERRIDE
              echo "⚠️  Using temporary CSS budget override: $CSS_BUDGET bytes"
            fi
            
            # Check for expired overrides
            EXPIRED=$(jq -r --arg date "$CURRENT_DATE" '.overrides[] | select(.expires <= $date) | .ticket' $OVERRIDES_FILE)
            if [ ! -z "$EXPIRED" ]; then
              echo "❌ Found expired budget overrides. Please resolve tickets: $EXPIRED"
              exit 1
            fi
          fi
          
          # Measure actual sizes
          JS_SIZE=$(find dist -name "*.js" -type f -exec stat -f%z {} + | awk '{s+=$1} END {print s}')
          CSS_SIZE=$(find dist -name "*.css" -type f -exec stat -f%z {} + | awk '{s+=$1} END {print s}')
          
          echo "JS Bundle: $JS_SIZE bytes (budget: $JS_BUDGET)"
          echo "CSS Bundle: $CSS_SIZE bytes (budget: $CSS_BUDGET)"
          
          if [ "$JS_SIZE" -gt "$JS_BUDGET" ]; then
            echo "❌ JS bundle exceeds budget limit"
            echo "To override: Create an ADR and update budget-overrides.json"
            exit 1
          fi
          
          if [ "$CSS_SIZE" -gt "$CSS_BUDGET" ]; then
            echo "❌ CSS bundle exceeds budget limit"
            echo "To override: Create an ADR and update budget-overrides.json"
            exit 1
          fi
          
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
          retention-days: 7

  security:
    name: Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Run security audit
        run: pnpm audit --production
        
      - name: Check for known vulnerabilities
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
          
      - name: Upload security results
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'
```

### VSCode Settings

### Branch Protection Rules (3.10)

Implementing branch protection ensures that your `master` branch always stays in a releasable state. The rules below apply to **both MVP and Showcase tracks**.

1. **Create a protection rule**
   - Navigate to **Repository → Settings → Branches → Branch protection rules**.
   - Click **Add rule** and set **Branch name pattern** to `master` (or your default branch).

2. **Require status checks to pass**
   - Enable **Require status checks to pass before merging**.
   - Select the following check that is created by the CI workflow above:
     - `CI / build-test` – combined lint, format, type-check, and build job
   - Keep **Require branches to be up to date before merging** enabled to prevent stale merges.

3. **Additional recommended settings**
   - **Require a pull-request review before merging** → `1` approving review.
   - **Dismiss stale pull request approvals when new commits are pushed**.
   - **Require linear history** to avoid merge commits.
   - **Include administrators** so that rules apply to everyone.

4. **Automating with `gh` CLI (optional)**

   The same rule can be applied programmatically:

   ```bash
   gh api \
     --method PUT \
     -H "Accept: application/vnd.github+json" \
     /repos/:owner/:repo/branches/master/protection \
     -F required_status_checks.strict=true \
     -F required_status_checks.contexts[]='CI / build-test' \
     -F enforce_admins=true \
     -F required_pull_request_reviews.dismiss_stale_reviews=true \
     -F required_pull_request_reviews.required_approving_review_count=1 \
     -F restrictions=null
   ```

> Once the rule is in place, any pull request that does **not** pass the CI workflow will be blocked from merging, completing step **3.10** of this phase.

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["clsx\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### Contributing Guidelines

```markdown
# Contributing Guide

## Development Setup

1.  Install dependencies:

        ```bash
        pnpm install
        ```

2.  Build design tokens:

        ```bash
        pnpm run build:tokens # Note: You'll need to create the './scripts/build-tokens.js' file as part of implementing the design token system (Phase 2).
        ```

3.  Start development server:

        ```bash
        pnpm run dev
        ```

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
