---
title: Phase 2 - Code Examples  
lastUpdated: true
description: >-
  Code examples for Phase 2
tableOfContents: true
pagefind: true
---

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

Implementing branch protection ensures that your `main` branch always stays in a releasable state.

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
```
