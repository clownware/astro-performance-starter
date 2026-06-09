# Stack

Technology facts. This file updates when dependencies change or commands move; rules elsewhere are stable.

## Versions

- **Framework:** Astro 6.x + Vite 7.x (zero JS by default)
- **Package manager:** pnpm 10.x (engine-strict, locked in `package.json`)
- **Runtime:** Node.js 24.x LTS (see `.nvmrc`)
- **Styling:** Tailwind CSS v4.x with CSS-native `@theme inline` design tokens
- **Code quality:** Biome 2.x (replaces ESLint + Prettier)
- **Content:** MDX + Astro Content Collections with Zod schemas
- **Islands:** Preact for interactive components
- **Images:** Astro Image + Sharp (AVIF + WebP)
- **TypeScript:** v5.x strict mode with `@astrojs/check`

## Key Commands

```bash
pnpm quality          # format + lint + lint:md + type-check (local — auto-fixes format)
pnpm quality:ci       # format:check + lint + lint:md + type-check (CI gate)
pnpm build            # tokens:build → astro build
pnpm test:unit        # Vitest (run once)
pnpm test:coverage    # Vitest with v8 coverage report
pnpm test:e2e         # Playwright (all browsers: Chromium, Firefox, WebKit)
pnpm test:a11y        # Accessibility tests (@a11y tag, axe-core)
pnpm perf:lighthouse  # Lighthouse HTML report
pnpm design:validate  # Semantic color contrast validation
pnpm budgets:validate # Budget override validation
```

Advanced/optional (not on the clone critical path, not in `quality:ci`):

```bash
pnpm test:mutate      # Stryker mutation testing — slow; nightly in CI (ADR-042)
```

## Performance Budgets

- **JavaScript:** < 160KB total raw (enforced in CI)
- **CSS:** < 50KB total
- **Images:** < 200KB each after optimisation
- **Lighthouse:** Performance 95+, Accessibility 98+
- **Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1

Check `docs/implementation-guides/reference/budgets-guardrails.md` before adding dependencies.

## Key ADRs

57 ADRs in `docs/adr/`. The structurally important ones:

- **ADR-001:** Preact island usage policy — never `client:load` without justification
- **ADR-023:** Testing strategy and coverage targets
- **ADR-033:** Implementation tiers (Foundation → Build → Polish)
- **ADR-034:** Dual-purpose docs strategy (Starlight + AI context)
- **ADR-035:** Template scope boundary (scope table in `.claude/workflow.md`)
- **ADR-036:** Layered constitution (this file structure)

## Deployment

- **Target:** Cloudflare Pages (global CDN)
- **Output:** `dist/`
- **Security headers:** `public/_headers`

## Cross-tool spine

The cross-tool agent context lives in [`AGENTS.md`](../AGENTS.md) at the repo root. It is generated from this file plus `CLAUDE.md`, `.claude/engineering.md`, and `.claude/workflow.md` via `pnpm agents:build`. CI fails if `AGENTS.md` drifts from its sources (see [ADR-045](../docs/adr/045-cross-tool-agents-spine.md)). Do not edit `AGENTS.md` directly; edit the source layer instead.
