// src/components/mdx/index.ts

import Callout from "./Callout.astro";
// Astro components
import Figure from "./Figure.astro";
import Grid from "./Grid.astro";

import Blockquote from "./Blockquote";
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
  Figure,
  Grid,
  Callout,

  // Override default HTML tags with custom components.
  // `a` tags in MDX will be rendered by `Link.tsx`.
  // `blockquote` tags will be rendered by `Blockquote.tsx`.
  a: Link,
  blockquote: Blockquote,

  // Example of how you might map `img` if you needed to customize it further,
  // but usually Astro's default handling is preferred.
  // import { Image as AstroImage } from 'astro:assets';
  // img: AstroImage,
};

export default components; // Allow default import
