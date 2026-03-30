# Astro Performance Starter — Claude Code Context

## Rules of Engagement

1. Check `docs/adr/` before suggesting architectural changes. Every **Accepted** ADR is a constraint.
2. No `client:load` without ADR justification (ADR-001). Prefer `client:idle` or `client:visible`.
3. Use design tokens from `tokens/` — never hardcode colors or spacing values.
4. TypeScript strict mode is non-negotiable.
5. Use Biome for linting/formatting, not ESLint/Prettier.
6. Use pnpm, not npm or yarn.
7. Prefer CSS solutions over JavaScript.
8. Use Astro Image component for all images — no raw `<img>` tags.
9. Before suggesting changes are complete, verify with `pnpm run quality`.

## Scope Boundaries (ADR-035)

| Category | Paths | Rule |
|----------|-------|------|
| **Modify freely** | `src/`, `astro.config.mjs`, `tsconfig.json`, `biome.json`, `package.json`, `tokens/`, `public/`, `.github/workflows/`, `.windsurfrules` | Full read/write |
| **Read-only** | `docs/` | Don't modify unless explicitly asked to update documentation |
| **Don't create** | Maintenance artifacts, deployment workflows, marketing content | Suggest adding to docs site instead |

## Tech Stack

- **Framework:** Astro 6.x + Vite 6.x (zero JS by default)
- **Package manager:** pnpm 10.x (engine-strict, locked in package.json)
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
pnpm quality:ci       # format:check + lint + lint:md + type-check (CI — fails on violations)
pnpm build            # tokens:build → astro build
pnpm test:unit        # Vitest (run once)
pnpm test:e2e         # Playwright (all browsers: Chromium, Firefox, WebKit)
pnpm test:a11y        # Accessibility tests (@a11y tag, axe-core)
pnpm perf:lighthouse  # Lighthouse HTML report
pnpm design:validate  # Semantic color contrast validation
pnpm budgets:validate # Budget override validation
```

## Performance Budgets

- **JavaScript:** < 160KB total gzipped (enforced in CI)
- **CSS:** < 50KB total
- **Images:** < 200KB each after optimization
- **Lighthouse:** Performance 95+, Accessibility 98+
- **Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1

Check `docs/implementation-guides/reference/budgets-guardrails.md` before adding dependencies.

## Architecture Decision Records

35+ ADRs live in `docs/adr/`. Check them before making architectural decisions. If a relevant ADR exists, follow it. If you're making a decision that should be an ADR, say so.

Key ADRs:

- **ADR-001:** Preact island usage policy — never `client:load` without justification
- **ADR-023:** Testing strategy and coverage targets
- **ADR-033:** Implementation tiers (Foundation → Build → Polish)
- **ADR-034:** Dual-purpose docs strategy (Starlight + AI context)
- **ADR-035:** Scope boundaries (table above)

## Component Conventions

Atomic design hierarchy in `src/components/`:

- `atoms/` — basic UI elements (Button, Badge, Icon)
- `molecules/` — combinations (Card, ContactForm, PostCard)
- `structural/` — layout (Container, Header, Footer, Section)
- `a11y/` — accessibility (SkipLink)
- `mdx/` — MDX-specific (Callout, Figure, CodeFromFile)

Rules: TypeScript-first (Props interface required), slots over props, accessibility built-in, zero JS by default.

See `docs/patterns/component-patterns.md` for the full spec.

## Design System

Tokens are the single source of truth in `tokens/`. Build with `pnpm run tokens:build`.

- Semantic naming: `foreground.primary`, `background.secondary`, `border.primary`
- CSS variables: `--color-foreground-primary`, `--color-background-primary`
- Tailwind classes: `text-foreground-primary`, `bg-background-secondary`
- Dark mode: system preference detection via `.dark` class
- **Never:** hardcoded colors (`bg-white`, `text-gray-600`), manual dark variants (`dark:bg-gray-800`)

## Naming Conventions

- Directories: `lowercase-dashes` (e.g., `components/hero-section`)
- Components: `PascalCase` (e.g., `HeroSection.astro`)
- Utilities: `camelCase` (e.g., `formatDate.ts`)
- Content slugs/URLs: `kebab-case`
- Design tokens: semantic names (`primary`, `secondary`)

## TypeScript (Astro-Specific)

- tsconfig extends `astro/tsconfigs/strict` with `strictNullChecks: true`
- `ComponentProps<typeof Component>` for extending framework components
- `@ts-ignore` with clear comments for complex framework type intersections
- Absolute imports via `@/` aliases (see `tsconfig.json` paths)
- Content Collections use Zod schemas for type-safe content

## Testing Requirements

- **New components:** unit tests with Vitest (`src/**/__tests__/*.test.ts`)
- **New pages:** E2E tests with Playwright (`e2e/*.spec.ts`)
- **Accessibility:** tests tagged `@a11y`, use `@axe-core/playwright`
- **Performance:** maintain budgets above, JS bundle enforced in CI

## Git Hooks

- Pre-commit: `lint-staged` runs Biome check on staged files
- Commit-msg: `commitlint` enforces conventional commit format
- Branch naming: `feature/*`, `fix/*`, `docs/*`, `chore/*`

## Deployment

- Target: Cloudflare Pages (global CDN)
- Output: `dist/`
- Security headers: `public/_headers`

## Keeping Rules in Sync

`.windsurfrules` and this file serve the same purpose for different tools. When updating standards, update both. See `docs/ai-context/ai-rules-setup.md` for multi-tool setup.
