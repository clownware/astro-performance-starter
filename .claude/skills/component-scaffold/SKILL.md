---
name: component-scaffold
description: "Scaffolds new Astro or Preact components following project patterns. Use when asked to create a component, scaffold a component, add a new component, or build a UI element."
allowed-tools: Bash, Read, Write, Glob
license: MIT
---

Scaffold a new component for this project: $ARGUMENTS

## Current conventions (pre-fetched)

**Component directory structure:**
!`find src/components -type f \( -name "*.astro" -o -name "*.tsx" \) | sort`

## Steps

### 1. Read the component patterns

Read `docs/patterns/component-patterns.md` for the current conventions. Key rules:

- **TypeScript-first:** every component needs a Props interface
- **Composition over configuration:** prefer slots over props
- **Accessibility built-in:** ARIA labels, keyboard navigation, semantic HTML
- **Zero JS by default:** Astro components for static, Preact islands only for complex interactive state

### 2. Determine component type

Based on the user's request:

**Astro component** (default — use unless interactive state is needed):

- File: `src/components/{level}/{Name}.astro`
- Props defined in frontmatter `interface Props { }` block
- Template with `<slot />` for composition

**Preact island** (only when client-side state management is required):

- File: `src/components/{level}/{Name}.tsx`
- `export default function {Name}(props: Props) { }`
- `import { useState } from "preact/hooks"` if needed
- Requires a `client:` directive when used — prefer `client:visible` or `client:idle`

### 3. Determine atomic design level

Place the component in the correct directory:

| Level | Directory | Examples | When to use |
|-------|-----------|----------|-------------|
| Atom | `atoms/` | Button, Badge, Icon, Image | Single-purpose, no children components |
| Molecule | `molecules/` | Card, PostCard, ContactForm | Combines atoms, moderate complexity |
| Structural | `structural/` | Container, Header, Footer, Section | Page layout and structure |
| A11y | `a11y/` | SkipLink | Accessibility-specific utilities |
| MDX | `mdx/` | Callout, Figure, CodeFromFile | Used in MDX content |

If the user doesn't specify, infer from the component's purpose.

### 4. Generate the component

**For Astro components**, follow this structure:

```astro
---
interface Props {
  // Required props first, then optional with defaults
  variant?: "default" | "alternate";
  class?: string;
}

const {
  variant = "default",
  class: className,
  ...rest
} = Astro.props;
---

<div
  class:list={["base-styles", className]}
  {...rest}
>
  <slot />
</div>
```

**For Preact islands**, follow this structure:

```tsx
import { useState } from "preact/hooks";

interface Props {
  // Props interface
}

export default function ComponentName({ ...props }: Props) {
  // Component logic
  return (
    <div>
      {/* Template */}
    </div>
  );
}
```

### 5. Apply project conventions

- **Design tokens:** Use semantic Tailwind classes — `text-foreground-primary`, `bg-background-secondary`, `border-border-primary`. Never hardcode colors.
- **Dark mode:** Handled automatically by token system. No manual `dark:` variants needed.
- **Accessibility:** Include `role`, `aria-*` attributes, and keyboard event handlers where applicable. Generate unique IDs for `aria-labelledby` relationships.
- **Motion:** Respect `prefers-reduced-motion` with `motion-reduce:` Tailwind variant.
- **Responsive:** Mobile-first with Tailwind breakpoints.

### 6. Output

Write the component file to the correct path. Tell the user:

- Where the file was created
- How to use it (import path and basic usage example)
- Whether it needs a `client:` directive (Preact islands only)
- If tests should be added (`src/**/__tests__/` for units, `e2e/` for E2E)
