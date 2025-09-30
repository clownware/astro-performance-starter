// src/components/mdx/index.ts

// Dynamic import wrapper to avoid loading .astro during Node evaluation
let callout: unknown;
try {
  callout = (await import("./Callout.astro")).default;
} catch {
  callout = () => null;
}
// Astro components
let figure: unknown;
try {
  figure = (await import("./Figure.astro")).default;
} catch {
  figure = ({ children }: { children: unknown }): unknown => children;
}
let grid: unknown;
try {
  grid = (await import("./Grid.astro")).default;
} catch {
  grid = ({ children }: { children: unknown }): unknown => children;
}
// Register Blockquote.astro for MDX <blockquote>
let blockquote: unknown;
try {
  blockquote = (await import("./Blockquote.astro")).default;
} catch {
  blockquote = ({ children }: { children: unknown }): unknown => children;
}

// Preact components (ensure .tsx files are processed by Preact integration)
import Link from "./Link";

// Astro's built-in Image component for <img> tags
// We don't need to import `Image` here directly for the `img` key.
// Astro's MDX integration will use `astro:assets`'s Image component for `<img>` tags by default
// if `mdx.optimize` is enabled or if you explicitly map it in astro.config.mjs.
// For clarity, if you want to ensure it or provide specific defaults, you might map it.
// However, typically, you'd let Astro's default MDX image handling work.
// If you need to pass props or wrap it, then you'd import and map it.

export const components = {
  // Custom Astro components. These are referenced by their tag name in MDX.
  // e.g., <Figure src="..." alt="..." />
  // biome-ignore lint/style/useNamingConvention: MDX component tag mapping requires PascalCase keys
  Figure: figure,
  // biome-ignore lint/style/useNamingConvention: MDX component tag mapping requires PascalCase keys
  Grid: grid,
  // biome-ignore lint/style/useNamingConvention: MDX component tag mapping requires PascalCase keys
  Callout: callout,

  // Override default HTML tags with custom components.
  // `a` tags in MDX will be rendered by `Link.tsx`.
  // `blockquote` tags will be rendered by `Blockquote.astro`.
  a: Link,
  blockquote: blockquote,

  // Example of how you might map `img` if you needed to customize it further,
  // but usually Astro's default handling is preferred.
  // import { Image as AstroImage } from 'astro:assets';
  // img: AstroImage,
};

export default components; // Allow default import
