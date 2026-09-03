---
title: Performance Budgets & Quality Guardrails
lastUpdated: true
description: >-
  Defines performance budgets, Core Web Vitals targets, and quality guardrails
  for the project
tableOfContents: true
pagefind: true
---
## Performance Budgets

### Core Web Vitals Targets

| Metric | Target | Maximum | Measurement |
|--------|--------|---------|-------------|
| **LCP** (Largest Contentful Paint) | < 1.5s | 2.5s | 75th percentile |
| **CLS** (Cumulative Layout Shift) | < 0.05 | 0.1 | Session window |
| **INP** (Interaction to Next Paint) | < 150ms | 200ms | 75th percentile |
| **TTFB** (Time to First Byte) | < 400ms | 800ms | 75th percentile |
| **FCP** (First Contentful Paint) | < 1.0s | 1.8s | 75th percentile |

> **Note on Targets**: The `Target` values aim for an excellent user experience, while the `Maximum` values align with Google's "good" threshold. The INP target is set pragmatically to provide a high-performance goal without causing excessive CI noise for minor fluctuations. (FID was removed from this table when Google retired it in favour of INP.)

### Lighthouse Score Requirements

| Category | Essential Minimum | Advanced Target | Non-negotiable |
|----------|-------------------|-----------------|----------------|
| **Performance** | 95 | 97+ | 90 |
| **Accessibility** | 98 | 100 | 95 |
| **Best Practices** | 100 | 100 | 95 |
| **SEO** | 95 | 100 | 90 |

### Bundle Size Limits

```yaml
JavaScript:
  total_raw: 160KB maximum   # ENFORCED — uncompressed bytes in dist/_astro (ci.yml inline gate + budgets.json maxTotalSizeKb via perf:budgets)
  per_file_raw: 64KB maximum # ENFORCED — budgets.json maxSizeKb via perf:budgets
  breakdown:
    - Framework (Preact): ~10KB
    - Custom code: ~20KB
    - Third-party: ~130KB
  
  per_route_budget:
    - Home: 50KB
    - Content pages: 30KB
    - Interactive pages: 100KB

CSS:
  total_uncompressed: 50KB # ADVISORY ONLY — tracked, not CI-gated. budgets.json carries no CSS budget; the figure comes from .claude/stack.md
  breakdown:
    - Tailwind base: ~20KB
    - Components: ~20KB
    - Utilities: ~10KB
  
  critical_css: 14KB maximum (above fold, uncompressed when inlined)

Fonts:
  per_file_raw: 64KB maximum   # ENFORCED — budgets.json (path _astro/fonts) via perf:budgets
  total_raw: 150KB maximum     # ENFORCED — budgets.json via perf:budgets
  preloads: fonts:gate         # ENFORCED — scripts/src/check-font-preloads.ts (ADR-058)

Images:
  per_file_raw: 200KB maximum  # ENFORCED — images:gate on source (public/, src/) AND dist/ (ADR-057)

HTML:
  per_page: 25KB gzipped
  inline_scripts: 0 (security) # Strictly enforced. See note below.
  inline_styles: Critical CSS only # For critical, above-the-fold styling.
```

Only the lines marked ENFORCED fail CI. `budgets.json` is the source of truth for the raw-size budgets (`pnpm run perf:budgets`, which also applies any unexpired entries from `budget-overrides.json`); the CSS figure is guidance you check by hand with `pnpm run bundle:analyze`.

## Note on inline_scripts: 0

This rule prohibits raw `<script>` tags directly in HTML output that are not managed by Astro's build process or explicitly allowed via CSP hashes/nonces.
For client-side JavaScript:

1. **Astro Islands (Preact — the only UI integration the starter ships)**: This is the PREFERRED METHOD.
   Use `client:idle` or `client:visible` — `client:load` is forbidden without ADR justification (ADR-001).
   Astro processes these island scripts, bundles them, and they can be managed with a Content Security Policy (CSP)
   that allows Astro's generated script hashes or uses nonces.
2. **Astro `<script>` tags (NOT `is:inline`)**: Astro processes, bundles, and hashes these scripts.
   These are generally CSP-friendly if your CSP is configured for Astro's output.
   However, for clarity and component encapsulation, prefer Astro Islands for UI-related interactivity.
3. **Hashed External Files**: If an island is not suitable for a small, critical script (e.g., theme persistence),
   the script can be an external file. Its integrity hash must be added to the `script-src` directive of your CSP.
   The `<script is:inline>` attribute should be AVOIDED as it injects scripts directly, bypassing Astro's processing
   and making CSP management more difficult unless manually hashed.

### Asset Optimization Requirements

```yaml
Images:
  formats: AVIF > WebP > JPEG (the Image atom emits single-format AVIF by default — ADR-030)
  max_size: 200KB per raster file, enforced on source and build output (images:gate, ADR-057)
  loading: lazy (except above fold)
  dimensions: Responsive srcset required
  quality: 75-85 (balanced)

Fonts:
  format: WOFF2 only (latin variable files vendored in src/assets/fonts/)
  subsetting: Required
  loading: Astro Fonts API — preload + metric-adjusted fallbacks (ADR-053); preload count gated by fonts:gate (ADR-058)
  limit: 2 font families maximum (Geist for display, Inter for body)
  variable_fonts: Preferred

Icons:
  format: SVG inline or sprite
  size: < 2KB per icon
  optimization: SVGO required
```

## Build Performance

| Metric | Target | Maximum |
|--------|--------|---------|
| **Cold Build** | < 30s | 60s |
| **Hot Reload** | < 200ms | 500ms |
| **Production Build** | < 2min | 5min |
| **Image Processing** | < 100ms/image | 500ms/image |

## Quality Guardrails

### Code Quality Metrics

```yaml
TypeScript:
  strict: true
  no_any: true
  no_explicit_any: Error

Unit test coverage (vitest.config.ts — ENFORCED by `pnpm run test:coverage` in CI):
  scope: src/utils/**/*.ts only # .astro components and build scripts are excluded from v8 coverage
  lines: 90%
  functions: 95%
  branches: 90%
  # Components are covered by Container API microtests (ADR-040) and Playwright, not by these thresholds.

Complexity:
  max_file_lines: 300
  max_function_lines: 50
  max_complexity: 10 (cyclomatic)
  max_dependencies: 30 (runtime)

Accessibility:
  WCAG_level: AA minimum
  keyboard_nav: 100% features
  screen_reader: Tested
  color_contrast: 4.5:1 minimum
  focus_visible: All interactive elements
```

### Security Requirements

```yaml
Headers:
  CSP: Strict policy required
  HSTS: max-age=31536000
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: Restrictive

Dependencies:
  vulnerability_scanning: Weekly
  update_frequency: Monthly
  audit_before_deploy: Required
  lock_file: Always committed
```

## Testing Coverage

| Type | Essential | Recommended | Advanced |
|------|-----------|-------------|----------|
| **Lighthouse CI** | Manual | Every commit | Every commit + RUM |
| **Accessibility** | Browser tools | Automated axe-core | Automated axe-core |
| **Visual Regression** | None | None | Manual `/showcase` review (ADR-049) |
| **E2E Critical Paths** | Manual checklist | Playwright automated | Playwright automated |
| **Performance** | Local only | CI | CI + monitoring |

No automated visual-regression suite ships with the starter — there is no `toHaveScreenshot` (or third-party snapshot service) anywhere in the repo. The `/showcase` page is the visual review surface; add Playwright screenshot assertions yourself if your component churn justifies them.

## Monitoring Thresholds

### Real User Monitoring (RUM)

```yaml
Alerts:
  performance_score_drop: -5 points
  error_rate: > 1%
  availability: < 99.9%
  response_time: > 1s average

Tracking:
  - Page views
  - Core Web Vitals
  - JavaScript errors
  - 404 errors
  - API response times
```

## Progressive Enhancement Budgets

### JavaScript Usage Tiers

1. **Tier 0: No JavaScript** (Preferred)
   - Pure CSS solutions
   - HTML form submissions
   - CSS animations/transitions

2. **Tier 1: Minimal Enhancement** (< 20KB)
   - `<ClientRouter />` from `astro:transitions` (view transitions)
   - Progressive form enhancement (ADR-021)
   - Vanilla JS for simple state

3. **Tier 2: Interactive Islands** (< 50KB per island)
   - Preact components
   - Lazy loaded with client:visible
   - Justified in ADR

4. **Tier 3: Rich Interactions** (< 100KB total)
   - Complex state management
   - Real-time features
   - Requires architecture review

## Enforcement Strategy

### Build-time Checks

```bash
# Bundle size check
# CI enforces this gate inline in .github/workflows/ci.yml: the total RAW
# (uncompressed) size of .js files emitted to dist/_astro must stay under
# 160KB (163840 bytes), matching budgets.json (maxTotalSizeKb: 160).
# `pnpm run perf:budgets` applies the same raw-size budgets locally.

JS_BUNDLE_PATH="dist/_astro"
JS_SIZE_LIMIT_BYTES=163840 # 160KB raw (uncompressed)
JS_SIZE=0

if [ ! -d "$JS_BUNDLE_PATH" ]; then
  echo "🟡 Warning: JavaScript bundle path '$JS_BUNDLE_PATH' not found. Skipping size check."
else
  # Determine OS for stat command compatibility
  if [ "$(uname)" == "Darwin" ]; then # macOS
    # The awk script sums the sizes. If no files are found, find returns nothing, awk sum is empty.
    JS_FILES_TOTAL_SIZE=$(find "$JS_BUNDLE_PATH" -name "*.js" -type f -exec stat -f%z {} + | awk '{sum+=$1} END {print sum}')
  else # Assuming Linux/GNU
    JS_FILES_TOTAL_SIZE=$(find "$JS_BUNDLE_PATH" -name "*.js" -type f -exec stat -c%s {} + | awk '{sum+=$1} END {print sum}')
  fi

  # Ensure JS_SIZE is a number, default to 0 if JS_FILES_TOTAL_SIZE is empty (e.g., no .js files)
  JS_SIZE=${JS_FILES_TOTAL_SIZE:-0}

  if [ "$JS_SIZE" -gt "$JS_SIZE_LIMIT_BYTES" ]; then
    echo "❌ JavaScript bundle raw size ($JS_SIZE bytes) exceeds the $JS_SIZE_LIMIT_BYTES-byte budget in '$JS_BUNDLE_PATH'."
    exit 1
  else
    echo "✅ JavaScript bundle raw size: $JS_SIZE bytes (limit: $JS_SIZE_LIMIT_BYTES bytes)."
  fi
fi
```

The same CI job then runs `pnpm run perf:budgets` (every `budgets.json` budget, with overrides applied), `pnpm run images:gate` twice (source tree, then `IMAGE_GATE_ROOTS=dist`), and `pnpm run fonts:gate`.

### Lighthouse CI Assertions

The enforced gate lives in `lighthouserc.json` (desktop) with a mirrored `lighthouserc.mobile.json` companion — `lighthouse.yml` runs `lhci autorun` against both and gates on both. Thresholds are set at the non-negotiable floor from the table above (no `lighthouse:recommended` preset):

```json
{
  "assert": {
    "assertions": {
      "categories:performance": ["error", { "minScore": 0.9 }],
      "categories:accessibility": ["error", { "minScore": 0.95 }],
      "categories:best-practices": ["error", { "minScore": 0.95 }],
      "categories:seo": ["error", { "minScore": 0.9 }]
    }
  }
}
```

### Git Hooks

```yaml
pre-commit: # .husky/pre-commit runs `pnpm exec lint-staged`
  - biome check --write (staged .astro/.ts/.tsx/.js/.jsx/.json/.yml files)
  - markdownlint-cli2 --fix (staged Markdown/MDX)

commit-msg: # .husky/commit-msg
  - commitlint --edit (conventional commits)

pre-push: # .husky/pre-push
  - pnpm run test:unit

# Heavier checks run in CI, not in git hooks:
ci:
  - quality:ci (format:check, lint, lint:md, astro check, test:unit, agents:check, version:check, og:check, docs:count)
  - enforce (ADR enforcement suite, ADR-064)
  - test:coverage (src/utils thresholds above)
  - budgets:validate + design:validate (override expiry, token contrast)
  - images:gate (source + dist), fonts:gate, perf:budgets, inline JS gate
  - playwright test --project=chromium
```

## Budget Exception Process

When budgets must be exceeded:

1. **Document in ADR**: Create Architecture Decision Record
2. **Measure Impact**: Provide before/after metrics
3. **Set Timeline**: Plan for optimization
4. **Get Approval**: Technical lead review
5. **Monitor Closely**: Set up specific alerts

## Performance Culture

### Daily Practices

- Check bundle size before commits
- Test on throttled connection
- Validate on real devices
- Monitor Core Web Vitals

### Weekly Reviews

- Performance regression check
- Dependency audit
- Image optimization review
- Third-party script audit

### Monthly Audits

- Full Lighthouse analysis
- Real user metrics review
- Competitive benchmarking
- Optimization opportunities
