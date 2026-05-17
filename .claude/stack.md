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

## Performance Budgets

- **JavaScript:** < 160KB total raw (enforced in CI)
- **CSS:** < 50KB total
- **Images:** < 200KB each after optimisation
- **Lighthouse:** Performance 95+, Accessibility 98+
- **Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1

Check `docs/implementation-guides/reference/budgets-guardrails.md` before adding dependencies.

## Key ADRs

35+ ADRs in `docs/adr/`. The structurally important ones:

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

## Multi-tool sync

`.windsurfrules` mirrors `CLAUDE.md` and the `.claude/` sublayers for Windsurf users. When updating standards in either file, update the other. See `docs/ai-context/ai-rules-setup.md` for the full multi-tool setup.
