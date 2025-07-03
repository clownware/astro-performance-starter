---
title: Phase 5 Plan
description: 'Plan for Phase 5'
lastUpdated: true
tableOfContents: false
pagefind: false
---

That's another excellent, nuanced question. While the "MVP Track" for Phase 5 is a great starting point, we can refine it further to maximize the template's flexibility and value. Not all MVP components are created equal.

My analysis is that we should implement most of the Phase 5 MVP components directly, but with a specific strategy. However, one of them is a perfect candidate to be moved "elsewhere" into the documentation flow, just like we did with analytics.

Here is the recommended breakdown for the Phase 5 MVP components:

## Implement Directly: The Core Structural & UI Primitives

These components form the absolute bedrock of the template's UI system. They are universal, provide immediate structure, and establish the core patterns of the template (props, styling with Tailwind, etc.). They should be implemented as simple, robust, and unopinionated .astro files.

* 5.01: Button Component: Implement. This is non-negotiable. It's the most fundamental interactive element.
* 5.02: Card Component: Implement. A simple, flexible container for content is a universal need.
* 5.03: Section Component: Implement. This is a critical structural component for managing vertical rhythm and spacing on a page.
* 5.04: Container Component: Implement. Essential for managing horizontal width and centering content.
* 5.07: Badge Component: Implement. A simple, non-interactive label is a common requirement and a great, simple component to include.
* 5.08: Grid Component: Implement. A basic, responsive grid component is a powerful layout tool that reinforces best practices.

For all of these, the implementation should be minimal. For example, the Button should have primary and secondary variants, but not the ten different color/style combinations a full design system might have. The goal is to provide a solid, extensible foundation.

## Implement as a Wrapper: The Astro-Specific Helper

This component's primary purpose is to abstract away a common Astro-specific task, making it easier for the end-user.

* 5.06: Image Component: Implement as a thin wrapper.

Action: Create an Image.astro component that is essentially a wrapper around Astro's built-in *Image* component.
Purpose: This might seem redundant, but it's a powerful pattern. The wrapper can enforce project-specific defaults (like format="avif" or default sizes), apply a consistent class for styling (e.g., for borders or shadows), and provide a single place to add future logic (like a caption). It teaches the user a valuable pattern for abstracting framework-specific features.

## Move Elsewhere (Document and Guide): The Opinionated Component

This component, while part of the MVP track, starts to get more opinionated about style and functionality. It's a perfect candidate to be an "empowerment" piece rather than a built-in feature.

* 5.05: Link Component: Do Not Implement Directly. Move to Documentation.

### Why?

A custom Link component can be surprisingly complex. Does it handle internal vs. external links differently? Does it automatically add rel="noopener"? Does it include an icon for external links? These are decisions the user should make. A basic <a> tag is often sufficient, and the user might prefer to use Tailwind's @apply directive to style their links globally.

### Better Place 1: A Dedicated Documentation Guide

Location: src/content/docs/implementation-guides/05-components/01-creating-components.md (or similar).
Content: Use the Link component as the primary tutorial for how to create a new component in the template.

The guide would walk the user through:

1. Creating the file: src/components/ui/Link.astro.
2. Defining the props (href, external, etc.).
3. Writing the logic to handle internal vs. external links.
4. Adding an external link icon, just as shown in the Phase 5 guide's Button example.

### Better Place 2: The global.css file

Action: Provide a very basic, commented-out style for anchor tags.

Example:

```css
/* A basic style for all links. Customize or replace with a Link component. */
/* a {
  @apply text-primary-600 underline hover:text-primary-700;
} */
```

Purpose: This gives the user an immediate, low-effort way to style their links while gently nudging them toward the more robust component-based solution documented in the guides.
Result: By moving the Link component into a tutorial, you transform it from a potentially unwanted, opinionated component into a powerful teaching tool that onboards the user to the template's architecture. They learn how to build their own components by following a practical, useful example.
