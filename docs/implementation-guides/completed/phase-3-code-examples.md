---
title: Phase 3 - Code Examples
description: >-
  Code examples for Phase 3
lastUpdated: true
tableOfContents: true
pagefind: true
---

## Code Examples

Companion to [Phase 3 - Essential Tooling & Quality Gates](/implementation-guides/completed/phase-3-tooling/).

### Biome Configuration

{% snippet "biome-config" %}

### Husky & Commitlint Configuration

{% snippet "commitlint-config" %}

{% snippet "git-hooks" %}

The starter also ships a `pre-push` hook that runs the unit suite (`pnpm run test:unit`) so failures surface locally instead of in CI.

### Updated Package Scripts

{% snippet "package-scripts" %}

> **Note on Local vs. CI Scripts**: The `quality` script is designed for fast local checks (it formats in place). The `quality:ci` script is the CI variant: `format:check`, `lint`, `lint:md`, `check`, `test:unit`, plus the repo's consistency gates (`agents:check`, `version:check`, `og:check`, `docs:count`). End-to-end tests are **not** part of `quality:ci` — CI runs Playwright as a separate step in `ci.yml`. The full script set is grouped cloner-facing first, maintainer scripts second ([ADR-052](/adr/052-script-taxonomy/)).

### Lint-staged Configuration

{% snippet "lint-staged-config" %}

### GitHub Actions CI Workflow

This is the starter's actual workflow. A single `build-test` job runs the full quality gate (`quality:ci`), the ADR enforcement suite, unit tests with coverage, budget-override and contrast validation, the build, the JS / raw-size / image / font-preload budget gates, Playwright e2e, and the dependency + SBOM security scans; `semgrep` and `gitleaks` run as separate jobs in the same workflow. External-link rot detection (`link-check.yml`, weekly plus docs PRs, not a required check) and the Lighthouse floors (`lighthouse.yml`) live in their own workflows.

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]
  # versions-sync.yml re-dispatches CI after it pushes a versions.json sync
  # commit to a Dependabot branch; GITHUB_TOKEN pushes never trigger runs.
  workflow_dispatch:

# A newer push to the same PR supersedes the running one; master pushes are
# never cancelled so the deploy-truth signal always completes.
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}

permissions:
  contents: read
  security-events: write

jobs:
  build-test:
    runs-on: ubuntu-latest
    # Every job carries a hard cap: a hung step otherwise runs to GitHub's
    # 360-minute default and burns the account's minute budget.
    timeout-minutes: 20
    env:
      SITE_URL: https://${{ github.repository_owner }}.github.io

    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Setup Node.js
        uses: actions/setup-node@v7
        with:
          node-version-file: '.nvmrc'

      - name: Setup PNPM
        uses: pnpm/action-setup@v6
        with:
          run_install: false

      - name: Get pnpm store directory
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_OUTPUT
        id: pnpm-cache

      - name: Cache pnpm store
        uses: actions/cache@v6
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint, format & type-check
        run: pnpm run quality:ci

      - name: ADR enforcement suite (ADR-064, warn-only launch)
        run: pnpm run enforce

      - name: Unit tests with coverage
        run: pnpm run test:coverage

      - name: Upload coverage report
        if: always()
        uses: actions/upload-artifact@v7
        with:
          name: coverage-report
          path: coverage/
          retention-days: 14
          if-no-files-found: ignore

      - name: Validate budget overrides
        run: pnpm run budgets:validate

      - name: Validate semantic color contrast
        run: pnpm run design:validate

      - name: Build site
        run: pnpm run build

      - name: Enforce JS bundle size budget
        shell: bash
        run: |
          set -e
          JS_BUNDLE_PATH="dist/_astro"
          JS_SIZE_LIMIT_BYTES=163840 # 160 KB raw JS
          if [ ! -d "$JS_BUNDLE_PATH" ]; then
            echo "JS bundle path not found. Skipping size check."
            exit 0
          fi
          JS_SIZE=$(find "$JS_BUNDLE_PATH" -name "*.js" -type f -exec stat -c%s {} + | awk '{sum+=$1} END {print sum}')
          JS_SIZE=${JS_SIZE:-0}
          echo "Total raw JS size: $JS_SIZE bytes (limit: $JS_SIZE_LIMIT_BYTES)"
          if [ "$JS_SIZE" -gt "$JS_SIZE_LIMIT_BYTES" ]; then
            echo "::error::JavaScript bundle size ($JS_SIZE bytes) exceeds limit ($JS_SIZE_LIMIT_BYTES bytes)"
            exit 1
          fi

      - name: Enforce raw-size budgets — budgets.json (with budget-overrides applied)
        run: pnpm run perf:budgets

      - name: Enforce per-image size budget — source (ADR-057)
        run: pnpm run images:gate

      - name: Enforce per-image size budget — build output (ADR-057)
        # Catches oversized emitted raster, e.g. heavyweight PNG fallbacks
        # generated alongside AVIF/WebP.
        run: IMAGE_GATE_ROOTS=dist pnpm run images:gate

      - name: Enforce font preload budget (ADR-058)
        run: pnpm run fonts:gate

      # Chromium is ~130MB per run uncached; key on the resolved Playwright
      # version so the cache invalidates exactly when the browser build does.
      - name: Get Playwright version
        id: playwright-version
        run: echo "version=$(node -p "require('@playwright/test/package.json').version")" >> "$GITHUB_OUTPUT"

      - name: Cache Playwright browsers
        id: playwright-cache
        uses: actions/cache@v6
        with:
          path: ~/.cache/ms-playwright
          key: ${{ runner.os }}-playwright-${{ steps.playwright-version.outputs.version }}

      # Browser download comes from Playwright's CDN — no apt on the critical path.
      - name: Install Playwright browsers
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        timeout-minutes: 5
        run: pnpm exec playwright install chromium

      # Safety net on both cache paths: ubuntu-latest already ships Chromium's
      # shared libraries, so a stalled apt mirror must not fail the job.
      - name: Install Playwright OS dependencies
        timeout-minutes: 3
        continue-on-error: true
        run: pnpm exec playwright install-deps chromium

      - name: Run E2E tests (Chromium)
        run: pnpm exec playwright test --project=chromium

      - name: Security audit (high severity)
        run: pnpm run audit:ci

      - name: Trivy SBOM scan
        uses: aquasecurity/trivy-action@v0.36.0
        with:
          scan-type: 'fs'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload security results
        if: success() && (hashFiles('trivy-results.sarif') != '')
        uses: github/codeql-action/upload-sarif@v4
        continue-on-error: true
        with:
          sarif_file: 'trivy-results.sarif'

  # SAST + secret scanning (ADR-046). Both are halt-on-violation gates (ADR-039):
  # the scan command exits non-zero on a finding and fails the build.
  semgrep:
    name: Semgrep SAST
    runs-on: ubuntu-latest
    timeout-minutes: 10
    # Dependabot PRs only touch manifests and run with a restricted token; skip.
    if: github.actor != 'dependabot[bot]'
    container:
      image: semgrep/semgrep
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Semgrep scan
        # --error exits 1 on findings; --config p/* pulls public registry rulesets.
        run: semgrep scan --config p/javascript --config p/typescript --config p/secrets --error

  gitleaks:
    name: Secret scan
    runs-on: ubuntu-latest
    timeout-minutes: 5
    if: github.actor != 'dependabot[bot]'
    container:
      image: ghcr.io/gitleaks/gitleaks:v8.30.1
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Gitleaks scan
        # `dir` scans the working tree; --exit-code 1 fails the build on any leak.
        run: gitleaks dir . --config .gitleaks.toml --exit-code 1 --verbose
```

Full file: [`.github/workflows/ci.yml`](https://github.com/clownware/astro-performance-starter/blob/master/.github/workflows/ci.yml). The enforced sizes behind the budget steps are listed in [Phase 3 - Essential Tooling & Quality Gates](/implementation-guides/completed/phase-3-tooling/#performance-budgets) and in full in [Performance Budgets & Quality Guardrails](/implementation-guides/reference/budgets-guardrails/).

### Branch Protection Rules (3.10)

Implementing branch protection ensures that your `master` branch always stays in a releasable state. The rules below are Essential scope — every project applies them regardless of tier ([ADR-033](/adr/033-track-consolidation/)).

1. **Create a protection rule**
   - Navigate to **Repository → Settings → Branches → Branch protection rules**.
   - Click **Add rule** and set **Branch name pattern** to `master` (or your default branch).

2. **Require status checks to pass**
   - Enable **Require status checks to pass before merging**.
   - Select the checks created by the CI workflow above (context names follow `<workflow> / <job name>`; jobs without a `name:` key surface under their job id):
     - `CI / build-test` – quality gate, unit tests, budgets, build, e2e, security audit
     - `CI / Semgrep SAST` and `CI / Secret scan` – security gates
     - Optionally `Lighthouse CI / lighthouse` – the Lighthouse category floors from `lighthouse.yml`
   - The `Link Check / link-check` job is deliberately **not** a required check — it detects external-link rot on a schedule and informs without blocking.
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
     -F required_status_checks.contexts[]='CI / Semgrep SAST' \
     -F required_status_checks.contexts[]='CI / Secret scan' \
     -F enforce_admins=true \
     -F required_pull_request_reviews.dismiss_stale_reviews=true \
     -F required_pull_request_reviews.required_approving_review_count=1 \
     -F restrictions=null
   ```

> Once the rule is in place, any pull request that does **not** pass the CI workflow will be blocked from merging, completing step **3.10** of this phase.

### VSCode Settings (optional)

The starter does not ship a `.vscode/` directory — editor configuration is left to each developer (see [Recommended Extensions](/development/recommended-extensions/)). If you want format-on-save with Biome in VSCode, a suggested `settings.json`:

```json
// .vscode/settings.json (not shipped with the starter — create it yourself if wanted)
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

The starter's real guide is [`CONTRIBUTING.md`](https://github.com/clownware/astro-performance-starter/blob/master/CONTRIBUTING.md) (with a longer version under [Contributing](/development/CONTRIBUTING/)). The minimal skeleton for your own project:

````markdown
# Contributing Guide

## Development Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Build design tokens (optional — `predev` and `build` run this automatically;
   the script ships with the starter as `scripts/src/build-tokens.ts`):

   ```bash
   pnpm run tokens:build
   ```

3. Start development server:

   ```bash
   pnpm run dev
   ```

4. Before opening a PR, run the same gate CI runs:

   ```bash
   pnpm run quality:ci
   ```
````
