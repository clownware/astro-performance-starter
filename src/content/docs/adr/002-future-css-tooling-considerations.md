---
title: 'ADR-002: Future CSS Tooling Considerations (UnoCSS/Plugins)'
version: 1.0.0
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  A note on potential future exploration of UnoCSS or advanced Tailwind plugins
  for specific CSS needs.
---
## Status

Proposed (For future consideration / ADR Backlog)

## Context

The project currently utilizes Tailwind CSS {{versions.tailwindcss}}, which provides a comprehensive utility-first CSS framework and integrates with our design token system. This ADR serves as a placeholder to note potential future CSS tooling enhancements that could be considered if specific needs arise, such as:

-   **Per-component tokens**: More granular token scoping directly within component definitions.
-   **Design-system-driven class extraction**: Automating the generation of CSS classes based on design system usage.
-   **Build time optimization**: Leveraging on-demand CSS engines to potentially reduce build times for very large projects.

## Potential Solutions Noted

-   **UnoCSS**: An on-demand atomic CSS engine that offers high customizability and performance. It could provide benefits in build speed and flexible configuration.
-   **Advanced Tailwind CSS Plugins**: Exploring or developing custom Tailwind plugins that might offer more sophisticated token management or class extraction capabilities beyond the core offerings.

## Current Stance

This is **not an urgent requirement** nor a proposal to change the current CSS tooling immediately. Tailwind CSS {{versions.tailwindcss}} is the established choice for this project.

This note is intended for an "ADR backlog" to be revisited if the project scales significantly or specific limitations in the current CSS workflow become apparent.

## Next Steps

-   No immediate action required.
-   Re-evaluate if challenges arise with Tailwind CSS regarding build performance with a very large number of utilities, or if a strong need for per-component token scoping/class extraction emerges that cannot be efficiently addressed with current tooling.

---

**Date**: 2025-06-10
**Outcome**: Noted for Future Consideration
