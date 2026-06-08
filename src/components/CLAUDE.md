# Component Conventions

## Atomic Design Hierarchy

- `atoms/` — smallest reusable elements (buttons, icons, badges)
- `molecules/` — combinations of atoms (cards, nav items, form groups)
- `structural/` — layout and page-level structure (headers, footers, sections)
- `islands/` — interactive Preact island components (hydrated client-side)
- `a11y/` — accessibility-specific components (skip links, focus traps)
- `mdx/` — components used in MDX content

## Rules

- Every component needs a `Props` interface
- Zero JavaScript by default — use Astro components for static content
- Framework components (Preact) only for complex interactive state

## Progressive Enhancement

CSS → View Transitions → Preact islands

Client directives:

- `client:visible` — lazy load when in viewport (default choice)
- `client:idle` — load when browser idle
- `client:media` — responsive loading
- `client:only` — skip SSR (rare)
- `client:load` — **never without ADR justification** (ADR-001)

## Reference

For detailed component patterns, see `docs/patterns/`.
For design token naming conventions, see `tokens/`.
