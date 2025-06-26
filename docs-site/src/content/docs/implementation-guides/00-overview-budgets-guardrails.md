---
title: Performance Budgets & Quality Guardrails
version: 2.0.0
lastUpdated: 2025-06-10T00:00:00.000Z
review: '2025-12-31'
description: >-
  Defines performance budgets, Core Web Vitals targets, and quality guardrails
  for the project.
---
## Performance Budgets

### Core Web Vitals Targets

| Metric | Target | Maximum | Measurement |
|--------|--------|---------|-------------|
| **LCP** (Largest Contentful Paint) | < 1.5s | 2.5s | 75th percentile |
| **FID** (First Input Delay) | < 75ms | 100ms | 75th percentile |
| **CLS** (Cumulative Layout Shift) | < 0.05 | 0.1 | Session window |
| **INP** (Interaction to Next Paint) | < 150ms | 200ms | 75th percentile |
| **TTFB** (Time to First Byte) | < 400ms | 800ms | 75th percentile |
| **FCP** (First Contentful Paint) | < 1.0s | 1.8s | 75th percentile |

> **Note on Targets**: The `Target` values aim for an excellent user experience, while the `Maximum` values align with Google's "good" threshold. Targets for INP and FID have been set pragmatically to provide a high-performance goal without causing excessive CI noise for minor fluctuations.

### Lighthouse Score Requirements

| Category | MVP Minimum | Showcase Target | Non-negotiable |
|----------|-------------|-----------------|----------------|
| **Performance** | 95 | 97+ | 90 |
| **Accessibility** | 98 | 100 | 95 |
| **Best Practices** | 100 | 100 | 95 |
| **SEO** | 95 | 100 | 90 |

### Bundle Size Limits

```yaml
JavaScript:
  total_gzipped: 160KB maximum
  breakdown:
    - Framework (Preact): ~10KB
    - Alpine.js: ~15KB
    - Custom code: ~20KB
    - Third-party: ~115KB
  
  per_route_budget:
    - Home: 50KB
    - Content pages: 30KB
    - Interactive pages: 100KB

CSS:
  total_uncompressed: 50KB maximum # Uncompressed size, aligns with general web perf advice for initial CSS payload
  breakdown:
    - Tailwind base: ~20KB
    - Components: ~20KB
    - Utilities: ~10KB
  
  critical_css: 14KB maximum (above fold, uncompressed when inlined)

HTML:
  per_page: 25KB gzipped
  inline_scripts: 0 (security) # Strictly enforced. See note below.
  inline_styles: Critical CSS only # For critical, above-the-fold styling.
```

## Note on inline_scripts: 0
This rule prohibits raw `<script>` tags directly in HTML output that are not managed by Astro's build process or explicitly allowed via CSP hashes/nonces.
For client-side JavaScript:
1. **Astro Islands (Preact, React, Vue, Svelte, SolidJS)**: This is the PREFERRED METHOD.
   Use client directives like `client:load`, `client:idle`, or `client:visible`.
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
  formats: AVIF > WebP > JPEG
  max_size: 200KB after optimization
  loading: lazy (except above fold)
  dimensions: Responsive srcset required
  quality: 75-85 (balanced)

Fonts:
  format: WOFF2 only
  subsetting: Required
  loading: font-display: swap
  limit: 2 font families maximum
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
  coverage: 90% of components

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

| Type | MVP | Showcase |
|------|-----|----------|
| **Lighthouse CI** | Manual | Every commit |
| **Accessibility** | Browser tools | Automated axe-core |
| **Visual Regression** | None | Astrobook snapshots |
| **E2E Critical Paths** | Manual checklist | Playwright automated |
| **Performance** | Local only | CI + monitoring |

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
   - Alpine.js for simple state
   - View Transitions API
   - Progressive form enhancement

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
# This script is an example of how you might enforce bundle size limits in a CI environment.
# It checks if the total RAW size of .js files in dist/assets exceeds a limit.
# NOTE: The JS_SIZE_LIMIT_BYTES (160KB) is a TARGET for GZIPPED assets. This script measures RAW file sizes.
# As raw sizes are typically 3-4x larger than gzipped, this script provides a very rough check.
# For accurate gzipped size validation, use tools that measure gzipped output.

JS_BUNDLE_PATH="dist/assets"
JS_SIZE_LIMIT_BYTES=163840 # 160KB (GZIPPED target)
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
    echo "❌ JavaScript bundle RAW size ($JS_SIZE bytes) is being compared against a GZIPPED target of $JS_SIZE_LIMIT_BYTES bytes in '$JS_BUNDLE_PATH'. This indicates a likely budget overrun."
    exit 1
  else
    echo "✅ JavaScript bundle RAW size: $JS_SIZE bytes (GZIPPED Target: $JS_SIZE_LIMIT_BYTES bytes). Ensure gzipped size is checked separately."
  fi
fi

# Lighthouse CI assertion
lighthouse:ci:
  assert:
    preset: lighthouse:recommended
    assertions:
      performance: [error, {minScore: 0.95}]
      accessibility: [error, {minScore: 0.98}]
      best-practices: [error, {minScore: 1}]
      seo: [error, {minScore: 0.95}]
```

### Pre-commit Hooks

```yaml
checks:
  - Image size validation
  - TypeScript strict check
  - Import cost analysis
  - CSS size check
  - Accessibility lint
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
