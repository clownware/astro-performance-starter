---
title: MDX Components Guide
description: Complete guide to using and customizing MDX components for enhanced content authoring
lastUpdated: 2025-09-30
tableOfContents: true
pagefind: true
---

## Overview

MDX combines Markdown with JSX, allowing you to use React/Preact components directly in your content. This template includes 6 production-ready MDX components that enhance your content with interactive elements, better semantics, and improved accessibility.

**Location**: `src/components/mdx/`

**Configuration**: Components are registered in `src/components/mdx/index.ts` and integrated via `astro.config.mjs`

---

## Component Registry

All MDX components are exported from `src/components/mdx/index.ts` and automatically available in `.mdx` files:

```typescript
// src/components/mdx/index.ts
export const components = {
  // Custom components (PascalCase in MDX)
  Figure: figure,
  Grid: grid,
  Callout: callout,
  
  // HTML tag overrides (lowercase in MDX)
  a: Link,
  blockquote: blockquote,
};
```

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
    "border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-950 px-6 py-4 my-6 text-foreground-primary",
    className,
  ]}
  cite={cite}
  aria-describedby={(author || source) ? citeId : undefined}
  {...blockquoteAttrs}
>
  <div class="flex items-start gap-4">
    <!-- Quote icon -->
    <svg
      class="h-6 w-6 shrink-0 text-primary-400 dark:text-primary-600 mt-1"
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
          class="mt-4 text-sm text-foreground-secondary not-italic"
        >
          <cite id={citeId} class="font-medium text-foreground-primary">
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

const baseClasses =
  "border-l-(--callout-border-width) p-(--callout-padding) my-(--callout-margin) rounded-r-(--callout-border-radius) shadow-sm";
const styleAttr = `--callout-padding: ${padding}; --callout-margin: ${margin}; --callout-border-width: ${borderWidth}; --callout-border-radius: ${borderRadius};`;

const typeStyles: Record<
  Props["type"],
  { border: string; background: string; text: string; defaultTitle: string }
> = {
  note: {
    border: "border-primary-500",
    background: "bg-primary-100",
    text: "text-primary-800",
    defaultTitle: "Note",
  },
  info: {
    border: "border-primary-400",
    background: "bg-primary-50",
    text: "text-primary-700",
    defaultTitle: "Information",
  },
  warning: {
    border: "border-secondary-500",
    background: "bg-secondary-100",
    text: "text-secondary-800",
    defaultTitle: "Warning",
  },
  danger: {
    border: "border-secondary-600",
    background: "bg-secondary-100",
    text: "text-secondary-800",
    defaultTitle: "Danger",
  },
  success: {
    border: "border-primary-600",
    background: "bg-primary-100",
    text: "text-primary-800",
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

const legacyClass = (Astro.props as any).class as string | undefined;
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
- CSS custom properties for spacing customization
- Design token integration

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

**Important**: Ensure your Tailwind configuration includes the grid classes used:

```css
/* In src/styles/global.css — use @source to safelist dynamic classes in v4 */
@source "../components/mdx/Grid.astro";
```

---

### 6. Link Component (Preact)

Enhanced link component that automatically handles internal vs external links with proper attributes.

**File**: `src/components/mdx/Link.tsx`

```typescript
// src/components/mdx/Link.tsx
import type { ComponentChildren, JSX } from "preact";

interface LinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  children: ComponentChildren;
  href?: string;
}

export default function Link({ children, href, class: className, ...props }: LinkProps) {
  const isExternal = href && (href.startsWith("http://") || href.startsWith("https://"));

  const defaultClasses =
    "text-primary-600 dark:text-primary-400 hover:underline focus:outline-hidden focus:ring-2 focus:ring-primary-500/50 rounded-sm";

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
- Adds `target="_blank"` and `rel="noopener noreferrer"` to external links
- Consistent styling with design tokens
- Focus states for keyboard navigation
- Works with Astro View Transitions

---

## Configuration

### Astro Config Integration

MDX components are configured in `astro.config.mjs`:

```javascript
// astro.config.mjs
import mdx from '@astrojs/mdx';
import { components } from './src/components/mdx/index.ts';

export default defineConfig({
  integrations: [
    mdx({
      // Make custom components available globally
      remarkPlugins: [],
      rehypePlugins: [],
      // Components are passed via the MDX integration
    }),
  ],
});
```

### Using Components in Content Collections

For Content Collections with MDX:

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
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
text-foreground-primary
bg-background-secondary
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

**Solution**: Add MDX types to `src/env.d.ts`:

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

- [Component Patterns](/patterns/component-patterns) - General component design patterns
- [Content Collections](/implementation-guides/07-content/01-content-collections) - Using MDX with Content Collections
- [Design Tokens](/architecture/design-tokens) - Customizing component styling
- [Accessibility](/patterns/accessibility) - WCAG compliance guidelines

---

## Summary

MDX components bridge the gap between Markdown simplicity and component power:

- **6 production-ready components** for common content needs
- **Zero JavaScript by default** (except Link component)
- **Full accessibility** with WCAG AA compliance
- **Design token integration** for consistent theming
- **Type-safe** with TypeScript interfaces

Use MDX components to create rich, interactive content while maintaining the simplicity of Markdown authoring.
