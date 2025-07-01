---
title: 'ADR 001: Preact Island Usage Policy'
description: "**Status**: Accepted\r **Date**: 2025-06-10\r"
last_reviewed_on: '2025-07-01'
---
# ADR 001: Preact Island Usage Policy

**Status**: Accepted
**Date**: 2025-06-10

## Context

This Astro starter template prioritizes performance and adheres to a "zero-JS by default" philosophy, as outlined in the Windsurf Project Rules (`docs/ai-context/INDEX.md`). Astro Islands allow for the integration of UI framework components (like Preact, Vue, Svelte) for interactive elements. However, introducing complex client-side JavaScript, especially from rich ecosystems like Preact {{versions.preact}}, Preact Query, TanStack Router), can significantly impact bundle sizes and page performance if not managed carefully.

The "Showcase" track of this starter template may require more complex, interactive UI components where leveraging the Preact ecosystem could offer development velocity or specific functionalities not easily replicated with vanilla JavaScript or simpler Astro components.

This ADR addresses the need for clear guidelines on when and how Preact components, particularly those relying on extensive client-side libraries, can be incorporated.

## Decision

1.  **Default to Astro Components & Vanilla JS**: For both MVP and Showcase tracks, the primary approach for UI development remains Astro components with minimal, targeted client-side JavaScript for interactivity. This aligns with the "Zero-JS by default; Islands only when needed" rule.

2.  **Preact Islands for Complex Interactivity (Primarily Showcase Track)**: The use of Preact components within Astro Islands is permissible, especially for the Showcase track, under the following conditions:
    *   The required functionality involves significant client-side state management, data fetching/caching, or complex UI interactions that are demonstrably more efficiently or robustly implemented with Preact and its ecosystem libraries (e.g., Preact Query for complex data synchronization, TanStack Router for intricate client-side navigation within an island).
    *   A lightweight Astro-native or vanilla JavaScript alternative is not reasonably available or would lead to significantly more complex and less maintainable code.
    *   The component is clearly an "island" of interactivity and not an attempt to build a full single-page application (SPA) experience within an Astro page.

3.  **`client:load` Directive Requires Justification**: As per Windsurf Rules, any use of `client:load` for an Astro Island (Preact or otherwise) must be justified via an ADR or clear documentation, especially if it introduces substantial JavaScript. Prefer `client:idle` or `client:visible` where possible.

4.  **Performance Budgets are Non-Negotiable**: All Preact Islands and their associated libraries must adhere to the project's strict performance budgets (JS bundle size, Lighthouse scores). The introduction of a Preact Island must not cause these budgets to be exceeded.

5.  **ADR for Significant Preact Ecosystem Dependencies**: If a Preact Island introduces a significant new Preact ecosystem dependency (e.g., a state management library, a routing library, a large data grid library), a brief ADR or a documented decision within the relevant component's documentation should justify its inclusion, outlining why it's necessary and how its performance impact is managed.

## Consequences

*   **Benefits**:
    *   Allows the Showcase track to leverage powerful Preact ecosystem libraries for complex UIs where appropriate.
    *   Provides a structured way to deviate from the zero-JS default when necessary.
*   **Potential Downsides**:
    *   Risk of increased client-side JavaScript if not carefully managed.
    *   Potential for hydration issues or compatibility quirks between Astro and specific Preact libraries, requiring careful testing.
    *   Increased build complexity or larger dependency trees.
*   **Mitigation**:
    *   Strict adherence to performance budgets.
    *   Mandatory justification (ADR or documentation) for significant Preact dependencies or `client:load` usage.
    *   Prioritizing Astro-native solutions and only resorting to complex Preact islands when clear benefits outweigh the costs.

## Scope

These guidelines apply to all development, but are particularly relevant for the "Showcase" track. The "MVP" track should adhere even more strictly to minimal JavaScript and Astro-native components.
