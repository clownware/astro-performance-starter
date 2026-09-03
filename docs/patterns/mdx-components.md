---
title: MDX Components Guide
description: Complete guide to using and customizing MDX components for enhanced content authoring
lastUpdated: true
tableOfContents: true
pagefind: true
---

## Overview

MDX combines Markdown with JSX, allowing you to use Astro and Preact components directly in your content. This template includes 6 production-ready MDX components that enhance your content with interactive elements, better semantics, and improved accessibility.

**Location**: `src/components/mdx/`

**Configuration**: Five components are registered in `src/components/mdx/index.ts` and passed to the MDX integration in `astro.config.mjs`; `CodeFromFile` is imported explicitly where used.

---

## Component Registry

The map exported from `src/components/mdx/index.ts` is what every `.mdx` file receives automatically (the `.astro` entries are loaded through guarded dynamic imports so the module can also be evaluated by Node when `astro.config.mjs` imports it):

```typescript
// src/components/mdx/index.ts (shipped — trimmed)
import Link from "./Link";

export const components = {
  // Custom components (PascalCase in MDX)
  Figure: figure,
  Grid: grid,
  Callout: callout,
  
  // HTML tag overrides (lowercase in MDX)
  a: Link,
  blockquote: blockquote,
};

export default components;
```

`CodeFromFile` is deliberately absent — it reads from disk at build time and takes a `parentUrl`, so it is imported per file.

---

## Components

### 1. Blockquote Component

Enhances standard Markdown blockquotes with visual styling, quote icons, and optional attribution.

**File**: `src/components/mdx/Blockquote.astro`

```astro
---
import type { HTMLAttributes } from "astro/types";

export interface Props extends HTMLAttributes<"blockquote"> {
  author?: string;
  source?: string;
  cite?: string;
  class?: string;
}

const { author, source, cite, class: className, ...blockquoteAttrs } = Astro.props;
const citeId = `quote-cite-${crypto.randomUUID()}`;
---

<blockquote
  class:list={[
    "border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-950 px-6 py-4 my-6 text-foreground",
    className,
  ]}
  cite={cite}
  aria-describedby={(author || source) ? citeId : undefined}
  {...blockquoteAttrs}
>
  <div class="flex items-start gap-4">
    <!-- Quote icon -->
    <svg
      class="h-6 w-6 shrink-0 text-link mt-1"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
    </svg>
    
    <div class="grow">
      <!-- Quote content -->
      <div class="text-lg leading-relaxed italic">
        <slot />
      </div>
      
      <!-- Attribution -->
      {(author || source) && (
        <footer
          class="mt-4 text-sm text-muted-foreground not-italic"
        >
          <cite id={citeId} class="font-medium text-foreground">
            {author && <span>— {author}</span>}
            {author && source && <span>, </span>}
            {source && <span>{source}</span>}
          </cite>
        </footer>
      )}
    </div>
  </div>
</blockquote>
```

**Usage in MDX**:

```mdx
> This is a standard blockquote that will be automatically styled with the Blockquote component.

> Performance is not just a feature, it's a fundamental requirement for modern web applications.
```

**With Attribution** (requires manual component usage):

```mdx
import Blockquote from '@/components/mdx/Blockquote.astro';

<Blockquote author="Tim Berners-Lee" source="Weaving the Web" cite="https://example.com">
  The web is more a social creation than a technical one. I designed it for a social effect.
</Blockquote>
```

**Key Features**:

- Automatic styling for all Markdown `>` blockquotes
- Optional author and source attribution
- Semantic `<cite>` element with proper ARIA attributes
- Visual quote icon
- Design token integration for theming

---

### 2. Callout Component

Alert-style component for highlighting important information with different severity levels.

**File**: `src/components/mdx/Callout.astro`

```astro
---
export interface Props {
  type: "note" | "warning" | "danger" | "info" | "success";
  title?: string;
  icon?: boolean;
  className?: string;
  useSprite?: boolean;
  spritePath?: string;
  padding?: string;
  margin?: string;
  borderWidth?: string;
  borderRadius?: string;
}

const {
  type = "note",
  title,
  icon = true,
  className,
  useSprite = false,
  spritePath = "/icons.svg",
  padding = "1rem",
  margin = "1.5rem",
  borderWidth = "4px",
  borderRadius = "0.375rem",
} = Astro.props as Props;

// Sizing applied via inline style so dynamic prop values resolve reliably;
// colour utility classes still drive the variant theming below.
const baseClasses = "shadow-sm motion-reduce:transition-none";
const styleAttr = `border-left-width: ${borderWidth}; padding: ${padding}; margin-top: ${margin}; margin-bottom: ${margin}; border-top-right-radius: ${borderRadius}; border-bottom-right-radius: ${borderRadius};`;

const typeStyles: Record<
  Props["type"],
  { border: string; background: string; text: string; defaultTitle: string }
> = {
  // Role tokens flip light/dark automatically — no manual dark: variants.
  note: {
    border: "border-link",
    background: "bg-primary/10",
    text: "text-foreground",
    defaultTitle: "Note",
  },
  info: {
    border: "border-link",
    background: "bg-primary/5",
    text: "text-foreground",
    defaultTitle: "Information",
  },
  warning: {
    border: "border-warning",
    background: "bg-warning/10",
    text: "text-foreground",
    defaultTitle: "Warning",
  },
  danger: {
    border: "border-error",
    background: "bg-error/10",
    text: "text-foreground",
    defaultTitle: "Danger",
  },
  success: {
    border: "border-success",
    background: "bg-success/10",
    text: "text-foreground",
    defaultTitle: "Success",
  },
};

const currentStyle = typeStyles[type];
const displayTitle = title === undefined ? currentStyle.defaultTitle : title;

const role = type === "warning" || type === "danger" ? "alert" : "region";
const hasTitle = Boolean(displayTitle);
const titleId = hasTitle ? `callout-${type}-${Math.random().toString(36).slice(2, 8)}` : undefined;
const ariaLabel = hasTitle ? undefined : currentStyle.defaultTitle;

const iconPaths: Record<Props["type"], string> = {
  note: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  warning:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
  danger: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
};
const iconPath = iconPaths[type] || iconPaths.note;

// Back-compat: accept legacy `class` prop if provided
const legacyClass = (Astro.props as { class?: string }).class;
const mergedClassName = className ?? legacyClass;
---

<div role={role} aria-labelledby={titleId} aria-label={ariaLabel} style={styleAttr} class:list={[baseClasses, currentStyle.border, currentStyle.background, currentStyle.text, mergedClassName]}>
  <div class="flex items-start">
    {icon && (
      <svg
        class="w-5 h-5 mr-3 mt-0.5 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <title>{`${currentStyle.defaultTitle} icon`}</title>
        {useSprite ? (
          <use href={`${spritePath}#${type}`} />
        ) : (
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={iconPath} />
        )}
      </svg>
    )}
    <div class="flex-1">
      {displayTitle && (
        <h3 id={titleId} class="font-semibold mb-1">{displayTitle}</h3>
      )}
      <div class="text-sm leading-6">
        <slot />
      </div>
    </div>
  </div>
</div>
```

**Usage in MDX**:

```mdx
<Callout type="note">
  This is a helpful note to provide additional context.
</Callout>

<Callout type="warning" title="Breaking Change">
  This API will be deprecated in version 2.0. Please migrate to the new endpoint.
</Callout>

<Callout type="danger" icon={false}>
  Critical security vulnerability detected. Update immediately.
</Callout>

<Callout type="success">
  Your changes have been saved successfully!
</Callout>

<Callout type="info" title="Pro Tip">
  Use keyboard shortcuts to speed up your workflow.
</Callout>
```

**Key Features**:

- 5 severity types (note, info, warning, danger, success)
- Customizable titles (defaults provided)
- Optional icons with SVG sprite support
- Proper ARIA roles (`alert` for warnings/danger, `region` for others)
- Spacing props (`padding`, `margin`, `borderWidth`, `borderRadius`) applied via an inline `style` attribute
- Role-token colours (`border-link`, `bg-warning/10`, …) that flip with the theme — no `dark:` variants needed

---

### 3. CodeFromFile Component

Loads and displays code from external files using Astro's Expressive Code integration.

**File**: `src/components/mdx/CodeFromFile.astro`

```astro
---
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { Code } from "astro-expressive-code/components";

export interface Props {
  src: string;
  lang: string;
  title: string;
  parentUrl: string;
}

const { src, lang, title, parentUrl } = Astro.props;

// Resolve the file path relative to the component that uses this one
const resolvedPath = new URL(src, parentUrl);
const code = await readFile(fileURLToPath(resolvedPath), "utf-8");
---

<Code code={code} lang={lang} title={title} />
```

**Usage in MDX**:

```mdx
import CodeFromFile from '@/components/mdx/CodeFromFile.astro';

<CodeFromFile 
  src="./example.ts" 
  lang="typescript" 
  title="Example TypeScript Code"
  parentUrl={import.meta.url}
/>
```

**Real-World Example**:

```mdx
---
title: API Documentation
---

Here's the complete implementation:

<CodeFromFile 
  src="../../../src/utils/blog.ts"
  lang="typescript"
  title="src/utils/blog.ts"
  parentUrl={import.meta.url}
/>
```

**Key Features**:

- Loads code from filesystem at build time
- Relative path resolution from MDX file location
- Integrates with Astro Expressive Code for syntax highlighting
- Supports all languages supported by Expressive Code
- Prevents code duplication in documentation

---

### 4. Figure Component

Semantic figure element with optional caption for images and media.

**File**: `src/components/mdx/Figure.astro`

```astro
---
import type { HTMLAttributes } from "astro/types";

export interface Props extends HTMLAttributes<"figure"> {
  src: string;
  alt: string;
  caption?: string;
}

const { src, alt, caption, ...figureAttrs } = Astro.props;
---

<figure {...figureAttrs}>
  <img src={src} alt={alt} />
  {caption && <figcaption>{caption}</figcaption>}
</figure>
```

**Usage in MDX**:

```mdx
<Figure 
  src="/images/architecture-diagram.png" 
  alt="System architecture showing microservices communication"
  caption="Figure 1: Microservices architecture with event-driven communication"
/>

<Figure 
  src="/images/performance-chart.webp" 
  alt="Performance comparison chart"
/>
```

**With Custom Styling**:

```mdx
<Figure 
  src="/images/hero.jpg" 
  alt="Hero image"
  caption="Photo by John Doe"
  class="my-8 rounded-lg shadow-lg"
/>
```

**Key Features**:

- Semantic HTML5 `<figure>` and `<figcaption>` elements
- Optional caption support
- Accepts all standard HTML figure attributes
- Works with Astro's image optimization when using Image component

**Note**: For optimized images, combine with Astro's Image component:

```mdx
import { Image } from 'astro:assets';
import myImage from '@/images/example.png';

<figure>
  <Image src={myImage} alt="Optimized image" />
  <figcaption>This image is automatically optimized</figcaption>
</figure>
```

---

### 5. Grid Component

Responsive grid layout component with Tailwind CSS integration.

**File**: `src/components/mdx/Grid.astro`

```astro
---
export interface Props {
  cols?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  gap?: number;
  class?: string;
}

const { cols = 1, sm, md, lg, xl, gap = 4, class: _className } = Astro.props as Props;

// Create responsive grid classes including all breakpoints
const _colClasses = [
  `grid-cols-${cols}`,
  sm && `sm:grid-cols-${sm}`,
  md && `md:grid-cols-${md}`,
  lg && `lg:grid-cols-${lg}`,
  xl && `xl:grid-cols-${xl}`,
  `gap-${gap}`,
].filter(Boolean);
---

<div class:list={["grid", ..._colClasses, _className]}>
  <slot />
</div>
```

**Usage in MDX**:

```mdx
<Grid cols={1} md={2} lg={3} gap={6}>
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
  <div>Column 4</div>
  <div>Column 5</div>
  <div>Column 6</div>
</Grid>

<Grid cols={2} lg={4} gap={4}>
  <Card title="Feature 1" />
  <Card title="Feature 2" />
  <Card title="Feature 3" />
  <Card title="Feature 4" />
</Grid>
```

**With Custom Classes**:

```mdx
<Grid cols={1} md={2} gap={8} class="my-12">
  <Callout type="note">
    Left column content
  </Callout>
  <Callout type="info">
    Right column content
  </Callout>
</Grid>
```

**Key Features**:

- Responsive breakpoints (sm, md, lg, xl)
- Customizable gap spacing
- Tailwind CSS grid utilities
- Flexible content (accepts any child elements)

**Important**: Tailwind only emits utilities it finds as literal strings in scanned source. `Grid.astro` builds its classes from template literals (`` `md:grid-cols-${md}` ``), so a column count is only generated if the same class appears literally somewhere else in the project. The values used on `/showcase` and in the blog content are covered today; if you use a combination nothing else uses, safelist it in `src/styles/global.css`:

```css
/* src/styles/global.css — safelist dynamic Grid classes (not currently needed by shipped content) */
@source inline("{sm:,md:,lg:,xl:,}grid-cols-{1,2,3,4,5,6}");
```

---

### 6. Link Component (Preact)

Enhanced link component that automatically handles internal vs external links with proper attributes.

**File**: `src/components/mdx/Link.tsx`

```tsx
// src/components/mdx/Link.tsx
import type { ComponentChildren } from "preact";

interface LinkProps {
  children: ComponentChildren;
  href?: string;
  class?: string;
  [key: string]: unknown;
}

export default function Link({ children, href, class: className, ...props }: LinkProps) {
  const isExternal = href && (href.startsWith("http://") || href.startsWith("https://"));

  const defaultClasses =
    "text-link hover:underline focus:outline-hidden focus:ring-2 focus:ring-primary-500/50 rounded-sm";

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        class={`${defaultClasses} ${className ?? ""}`}
        {...props}
      >
        {children}
        <span class="sr-only"> (opens in new tab)</span>
      </a>
    );
  }

  // For internal links (including anchors), let Astro handle them
  return (
    <a href={href} class={`${defaultClasses} ${className ?? ""}`} {...props}>
      {children}
    </a>
  );
}
```

**Usage in MDX**:

All standard Markdown links are automatically enhanced:

```mdx
[Internal link](/about)
[External link](https://example.com)
[Anchor link](#section)
```

**Manual Usage**:

```mdx
import Link from '@/components/mdx/Link';

<Link href="/docs/guide">Read the guide</Link>
<Link href="https://github.com/username/repo">View on GitHub</Link>
```

**Key Features**:

- Automatic detection of external links
- Adds `target="_blank"`, `rel="noopener noreferrer"` and a screen-reader-only "(opens in new tab)" hint to external links
- Consistent styling with the `text-link` role token
- Focus states for keyboard navigation
- Plain `<a>` output, so `<ClientRouter />` view transitions work unchanged

---

## Configuration

### Astro Config Integration

MDX components are configured in `astro.config.mjs`:

```javascript
// astro.config.mjs (shipped excerpt)
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import astroExpressiveCode from 'astro-expressive-code';
import { components as mdxComponents } from './src/components/mdx/index.ts';

export default defineConfig({
  integrations: [
    // Expressive Code must precede mdx() so <Code> is available to CodeFromFile
    astroExpressiveCode(),
    mdx({
      components: mdxComponents,
    }),
    preact(), // Link.tsx is a Preact component
  ],
});
```

Remark plugins (link validation, snippet includes) are configured on the top-level `markdown.processor`, not on `mdx()` — see [ADR-062](/adr/062-astro-7-upgrade-remark-retained/).

### Using Components in Content Collections

For Content Collections with MDX:

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
  }),
});

export const collections = { blog };
```

**In MDX files**:

```mdx
---
title: My Blog Post
description: A post using MDX components
date: 2024-01-15
---

<Callout type="info">
  This post uses MDX components!
</Callout>

Regular Markdown content here...

<Grid cols={2} gap={6}>
  <div>Column 1</div>
  <div>Column 2</div>
</Grid>
```

---

## Best Practices

### 1. Component Selection

**Use Blockquote for**:

- Quotes from people or sources
- Highlighting important statements
- Pull quotes in articles

**Use Callout for**:

- Warnings and alerts
- Tips and notes
- Status messages
- Important information that needs visual emphasis

### 2. Accessibility

All MDX components follow WCAG AA standards:

- **Blockquote**: Uses semantic `<cite>` with proper ARIA attributes
- **Callout**: Uses appropriate ARIA roles (`alert` for warnings, `region` for info)
- **Link**: Includes focus states and proper external link handling
- **Figure**: Uses semantic HTML5 elements
- **Grid**: Maintains logical reading order

### 3. Performance

- **CodeFromFile**: Loads code at build time (zero runtime cost)
- **Link**: Lightweight Preact component (~1KB)
- **Other components**: Pure Astro components (zero JavaScript shipped)

### 4. Styling

All components use design tokens for consistent theming:

```css
/* Components use semantic tokens */
text-foreground
bg-surface
border-primary-500
```

To customize, update your design tokens in `tokens/semantic.json`.

---

## Examples

### Documentation Page

```mdx
---
title: API Reference
description: Complete API documentation
---

<Callout type="info" title="Version">
  This documentation is for v2.0
</Callout>

## Authentication

<Callout type="warning">
  API keys must be kept secret. Never commit them to version control.
</Callout>

<CodeFromFile 
  src="./examples/auth.ts" 
  lang="typescript" 
  title="Authentication Example"
  parentUrl={import.meta.url}
/>

## Response Format

<Grid cols={1} md={2} gap={6}>
  <div>
    ### Success Response
    <CodeFromFile src="./examples/success.json" lang="json" title="Success" parentUrl={import.meta.url} />
  </div>
  <div>
    ### Error Response
    <CodeFromFile src="./examples/error.json" lang="json" title="Error" parentUrl={import.meta.url} />
  </div>
</Grid>
```

### Blog Post

```mdx
---
title: Building Fast Websites
date: 2024-01-15
---

<Figure 
  src="/images/performance.webp" 
  alt="Performance metrics comparison"
  caption="Figure 1: Before and after optimization"
/>

<Callout type="note">
  Performance is not just about speed—it's about user experience.
</Callout>

> The web is for everyone, and we should build it that way.

<Grid cols={1} lg={3} gap={6}>
  <Callout type="success" title="Fast">
    95+ Lighthouse score
  </Callout>
  <Callout type="success" title="Accessible">
    WCAG AA compliant
  </Callout>
  <Callout type="success" title="SEO">
    Optimized for search
  </Callout>
</Grid>
```

---

## Troubleshooting

### Components Not Rendering

**Issue**: MDX components don't appear in rendered output

**Solution**: Ensure components are exported in `src/components/mdx/index.ts`:

```typescript
export const components = {
  Callout: callout,
  Figure: figure,
  // ... other components
};
```

### TypeScript Errors

**Issue**: TypeScript errors when using components in MDX

**Solution**: The starter's `tsconfig.json` already loads `astro/client` types and the generated `.astro/env.d.ts`; run `pnpm astro sync` (or `pnpm run check`) to regenerate them after schema changes. The only checked-in augmentation is `src/types/astro-content.d.ts`, which re-exports `astro/content` under the `astro:content` module name. If your editor still cannot resolve `.mdx` imports, add a declaration file under `src/types/`:

```typescript
/// <reference types="astro/client" />
/// <reference types="@astrojs/mdx" />
```

### Styling Not Applied

**Issue**: Component styles don't match design system

**Solution**: Verify design tokens are built:

```bash
pnpm run tokens:build
```

### CodeFromFile Path Errors

**Issue**: `CodeFromFile` can't find source file

**Solution**: Use correct relative path and always pass `parentUrl`:

```mdx
<CodeFromFile 
  src="./relative/to/this/file.ts"
  parentUrl={import.meta.url}
  lang="typescript"
  title="Example"
/>
```

---

## Related Documentation

- [Component Patterns](/patterns/component-patterns/) - General component design patterns
- [Content Collections](/patterns/content-collections/) - Using MDX with Content Collections
- [How to Use Design Tokens](/development/how-to-use-design-tokens/) - Customizing component styling
- [Accessibility Guide](/implementation-guides/guides/accessibility-guide/) - WCAG compliance guidelines

---

## Summary

MDX components bridge the gap between Markdown simplicity and component power:

- **6 production-ready components** for common content needs
- **Zero JavaScript by default** (except Link component)
- **Full accessibility** with WCAG AA compliance
- **Design token integration** for consistent theming
- **Type-safe** with TypeScript interfaces

Use MDX components to create rich, interactive content while maintaining the simplicity of Markdown authoring.
