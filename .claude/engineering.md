# Engineering Defaults

Strong defaults with named exceptions. These rules apply with the same force as `CLAUDE.md`; the layering exists for organisation, not for softening.

## Components (Atomic Design)

Hierarchy in `src/components/`:

- `atoms/` — basic UI elements (Button, Badge, Icon)
- `molecules/` — combinations (Card, ContactForm, PostCard)
- `structural/` — layout (Container, Header, Footer, Section)
- `islands/` — hydrated Preact islands (SignalsCounter, MotionLab — ADR-060)
- `a11y/` — accessibility primitives (SkipLink)
- `mdx/` — MDX-specific (Callout, Figure, CodeFromFile)

Required for every component:

- TypeScript-first — export a `Props` interface
- Slots over props for content composition
- Accessibility built into the component, not bolted on
- Zero JavaScript by default; opt into hydration with the minimum-required `client:*` directive

See `docs/patterns/component-patterns.md` for the full spec. Component-scoped guidance lives in `src/components/CLAUDE.md`.

## Island Hydration (ADR-001)

`client:load` is forbidden without an ADR justifying it. The default is no hydration. When hydration is needed, escalate in this order:

1. Try `client:visible` (lazy until scroll)
2. Try `client:idle` (defer until browser idle)
3. Try `client:media` (responsive loading)
4. Only if none of the above works, open an ADR proposing `client:load`

`client:only` is reserved for components that cannot SSR (browser-only globals); use sparingly.

## Design System

Tokens are the single source of truth in `tokens/`. Build with `pnpm run tokens:build`.
The token layer is role-based (ADR-047): names describe intent, not tiers.

- Role naming: `background`, `surface`, `foreground`, `muted-foreground`, `border`, `border-emphasis`, `link`, `success`/`warning`/`error`
- CSS variables: `--color-foreground`, `--color-surface`, `--color-muted-foreground`
- Tailwind classes: `text-foreground`, `bg-surface`, `text-muted-foreground`, `text-link`
- Brand scales `primary`/`secondary` (50–950) are retained for gradients and hover states
- Status colours are single role tokens — tint with opacity (`bg-success/10`, `text-error`), never 3-step scales
- Typography: `font-display` (Geist headlines) / `font-text` (Inter body) via the `fontFamily` token group
- Dark mode: dark-first default; role tokens flip in `.dark` automatically (ADR-032)

Forbidden:

- Hardcoded colours (`bg-white`, `text-slate-600`) and old palette names (`gray`→`slate`, `moonstone`→`violet`)
- Manual dark variants (`dark:bg-slate-800`) — the role tokens handle this
- Hardcoded spacing values that bypass Tailwind's scale

## Images

The Astro `Image` component is required for all images. Raw `<img>` tags are forbidden outside the two ADR-030 exemptions (the wrapper's string-src fallback; unrasterisable SVGs with an inline justifying comment). Reasoning:

- Optimised single-format output (AVIF by default — ADR-030)
- Width/height attributes prevent CLS
- Lazy loading by default

For external images, use `<Image>` with the `inferSize` prop.

## TypeScript

- `tsconfig` extends `astro/tsconfigs/strict` with `strictNullChecks: true`
- Strict mode is non-negotiable — fix the types, do not disable checks to silence errors
- `ComponentProps<typeof Component>` for extending framework components
- `@ts-ignore` requires a comment explaining the framework intersection it works around
- Absolute imports via `@/` aliases (see `tsconfig.json` paths)
- Content Collections use Zod schemas for type-safe content

## Naming

| Where | Style | Example |
|---|---|---|
| Directories | `lowercase-dashes` | `components/hero-section` |
| Components | `PascalCase` | `HeroSection.astro` |
| Utilities | `camelCase` | `formatDate.ts` |
| Content slugs / URLs | `kebab-case` | `getting-started` |
| Design tokens | semantic | `primary`, `secondary` |

## Testing Discipline (ADR-037)

1. Before implementing, write or update the failing test. Show the failure output before writing production code.
2. Use Arrange / Act / Assert structure with one logical assertion per test.
3. No conditional assertions. If the assertion depends on configuration, fix the fixture so the configuration is deterministic.
4. Test names describe behaviour, not implementation.
5. Never lower a coverage threshold to make CI pass. Add the missing test or open an ADR documenting the exception.

The practical companion with examples lives at [`docs/development/testing-conventions.md`](../docs/development/testing-conventions.md). The exemplar test file is [`src/utils/__tests__/formatDate.test.ts`](../src/utils/__tests__/formatDate.test.ts). The Architect pass from [ADR-038](../docs/adr/038-agent-roles.md) produces the failing test these rules govern.
