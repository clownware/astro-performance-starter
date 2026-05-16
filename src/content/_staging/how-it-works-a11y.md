---
title: Accessibility
description: Philosophy and patterns from the Astro Performance Starter accessibility implementation.
status: staging
sourcePage: /showcase
movedFrom: src/pages/showcase.astro (Accessibility section)
---

# Accessibility

Every component is built accessibility-first. WCAG 2.1 AA as a floor, not a ceiling. Media queries respect user preferences; ARIA attributes are structural, not decorative.

## prefers-reduced-motion

Every animation in this template is wrapped in a motion preference check. Users who prefer reduced motion see content immediately without transitions. The ScrollReveal, ParallaxSection, and AnimatedGradientText components all respect this.

## prefers-contrast

Badge components gain heavier borders and font weights under `prefers-contrast: more`. No extra JavaScript — purely CSS media queries responding to OS-level accessibility settings.

## Keyboard Navigation

Tab through any page. Every interactive element has visible focus rings using design tokens. The Tabs component supports arrow keys. Dialog traps focus. Skip link jumps to main content.

## Semantic HTML

Native elements over ARIA roles: `<dialog>` not `role="dialog"`, `<details>` not custom accordions, `popover` not tooltip libraries. The platform provides the accessibility for free.
