# Stack

Technology facts. This file updates when dependencies change or commands move; rules elsewhere are stable.

## Versions

- **Framework:** Astro 7.x + Vite 8.x (zero JS by default)
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
pnpm quality:ci       # format:check + lint + lint:md + type-check + test:unit + agents/version/og/docs gates (CI gate)
pnpm build            # tokens:build → astro build
pnpm test:unit        # Vitest (run once)
pnpm test:coverage    # Vitest with v8 coverage report
pnpm test:e2e         # Playwright (all browsers: Chromium, Firefox, WebKit)
pnpm test:a11y        # Accessibility tests (@a11y tag, axe-core)
pnpm perf:lighthouse  # Lighthouse HTML report
pnpm design:validate  # Semantic color contrast validation
pnpm budgets:validate # Budget override validation
pnpm dev:agent        # Background dev server (detached, JSON status lines) — ADR-063
pnpm dev:agent:stop   # Stop the background dev server
```

Agent dev-server contract (ADR-063): `pnpm dev:agent` detaches; manage with
`pnpm exec astro dev status` / `astro dev logs --follow`; `GET /_astro/status`
returns `{"ok":true}`. That endpoint is **liveness-only** — it does not prove
the responding server belongs to *this* project. Port 4321 collisions have
silently pointed Playwright and Lighthouse at unrelated sites before: verify
ownership (`astro dev status` pid, or fetch a route unique to this site)
before running anything against the port.

Advanced/optional (not on the clone critical path, not in `quality:ci`):

```bash
pnpm test:mutate      # Stryker mutation testing — slow; weekly in CI (ADR-042)
```

## Performance Budgets

- **JavaScript:** < 160KB total raw (enforced in CI)
- **CSS:** < 50KB total (advisory — tracked, not CI-gated)
- **Images:** < 200KB each per raster file — source and build output (enforced in CI — ADR-057)
- **Font preloads:** ≤ 2 per page (enforced in CI — ADR-058)
- **Lighthouse:** CI floors — Performance ≥ 0.90, Accessibility ≥ 0.95, Best-Practices ≥ 0.95, SEO ≥ 0.90, gated on desktop and mobile (`lighthouserc.json` + `.mobile`); the 95+/98+ scores are the measured headline, not the gate
- **Core Web Vitals:** LCP < 2.5s, INP < 200ms, CLS < 0.1

Check `docs/implementation-guides/reference/budgets-guardrails.md` before adding dependencies.

## Key ADRs

65 ADRs in `docs/adr/`. The structurally important ones:

- **ADR-001:** Preact island usage policy — never `client:load` without justification
- **ADR-023:** Testing strategy and coverage targets
- **ADR-033:** Implementation tiers (Foundation → Build → Polish)
- **ADR-034:** Dual-purpose docs strategy (Starlight + AI context)
- **ADR-035:** Template scope boundary (scope table in `.claude/workflow.md`)
- **ADR-036:** Layered constitution (this file structure)

## Deployment

- **Target:** GitHub Pages via `.github/workflows/deploy.yml` (push to `master`); `SITE_URL` is set by the workflow
- **Output:** `dist/`
- **Security headers:** `public/_headers` — honoured by header-capable hosts (Cloudflare Pages, Netlify); a no-op on the GitHub Pages demo (ADR-051)

## Cross-tool spine

The cross-tool agent context lives in [`AGENTS.md`](../AGENTS.md) at the repo root. It is generated from this file plus `CLAUDE.md`, `.claude/engineering.md`, and `.claude/workflow.md` via `pnpm agents:build`. CI fails if `AGENTS.md` drifts from its sources (see [ADR-045](../docs/adr/045-cross-tool-agents-spine.md)). Do not edit `AGENTS.md` directly; edit the source layer instead.
