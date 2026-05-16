---
title: Modern CSS Features
description: Browser compatibility reference for the modern CSS specs that replace legacy JavaScript libraries throughout this template.
status: staging
sourcePage: /showcase
movedFrom: src/pages/showcase.astro (Modern CSS Features section)
---

# Modern CSS Features

The web platform has caught up to JavaScript frameworks. Every feature below replaces a JavaScript library with native CSS — zero bundle cost, zero runtime overhead.

## Scroll-Driven Animations

`animation-timeline: view()` and `scroll()`

- **Replaces:** AOS, ScrollMagic, GSAP ScrollTrigger
- **Chrome:** 115+
- **Firefox:** 135+
- **Safari:** 18.4+

## CSS @property

Type-safe custom properties with `syntax`, `initial-value`, `inherits`.

- **Enables:** gradient animation, integer interpolation
- **Chrome:** 85+
- **Firefox:** 128+
- **Safari:** 15.4+

## @starting-style

Entry animations for elements appearing in the DOM.

- **Replaces:** requestAnimationFrame, Intersection Observer
- **Chrome:** 117+
- **Firefox:** 129+
- **Safari:** 17.4+

## Popover API

`popover="hint"` with auto-dismiss and Escape-to-close.

- **Replaces:** tippy.js, Floating UI, Popper.js
- **Chrome:** 114+
- **Firefox:** 125+
- **Safari:** 17+

## Native &lt;dialog&gt;

Focus trapping, backdrop, stacking context — all built-in.

- **Replaces:** Radix Dialog, HeadlessUI, React Modal
- **Chrome:** 37+
- **Firefox:** 98+
- **Safari:** 15.4+

## Container Queries

`@container` responsive to parent, not viewport.

- **Enables:** truly reusable responsive components
- **Chrome:** 105+
- **Firefox:** 110+
- **Safari:** 16+
