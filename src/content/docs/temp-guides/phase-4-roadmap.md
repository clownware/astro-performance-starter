---
title: Phase 4 Roadmap
description: 'Phase 4 parts of the template that need to be implemented'
lastUpdated: true
tableOfContents: false
pagefind: false
---

# Audit of the Template's Completeness

Based on the
github-template-structure.md
d:\dev\03_production\astro_starter_template\src\content\docs\github-template-structure.md
and the Phase 4/5 implementation guides, here are the specific parts of the template that are incomplete or have not yet been built:

## 1. Core Layout and Pages (Phase 4)

The foundational structure for a runnable website is missing.

src/layouts/ Directory: This directory does not exist.
Missing: BaseLayout.astro
Missing: partials/Header.astro
Missing: partials/Footer.astro
src/pages/ Directory: This directory does not exist.
Missing: index.astro (the minimal homepage for the template).
Missing: 404.astro (the error page).

## 2. UI Component Library (Phase 5)

The reusable component library, which is a core part of the template's value, has not been created.

src/components/ Directory Structure: The current structure (/mdx) is for the documentation site. The template's component structure is missing.
Missing: The atoms/ and structural/ directories (or a ui/ directory as implied by the Phase 5 guide).
Missing: Button.astro
Missing: Card.astro
Missing: Section.astro
Missing: Container.astro
Missing: All other UI components outlined in the Phase 5 guide.

## 3. Public Assets and Configuration

The essential files for a production-ready website are not in place.

public/ Directory:
Missing: _headers (for security and caching rules).
Missing: favicon.svg (and other favicon variants).
Missing: robots.txt (for search engine crawlers).

## 4. GitHub Repository Files

A few specific files for repository management are missing.

.github/ISSUE_TEMPLATE/:
Missing: phase_completion.md

.github/:
Missing: The optional FUNDING.yml.

## Summary

The audit confirms that while the documentation site (Starlight) is well-established, the core template code that the documentation describes is largely missing. The implementation guides for Phase 4 (Skeleton) and Phase 5 (Components) outline the exact work that needs to be done to build out the foundational parts of the template.

## What to Implement in the Template (The Foundation)

These items represent the core, reusable foundation of the template. They provide immediate value, establish best practices, and accelerate development for the end-user without locking them into a specific design.

### From Phase 4: Skeleton & Routing

4.01: Base Layout (BaseLayout.astro): Implement. This is the absolute heart of the template. It should include the full metadata system (4.06) for SEO, OpenGraph tags, and a robust props interface as shown in the guide's code example.

4.02 & 4.03: Header & Footer Components: Implement. Provide simple, clean, and functional Header.astro and Footer.astro components. They should be structurally sound but stylistically minimal, allowing for easy customization.

4.04: Mobile Navigation: Implement the mechanism, not the content. Provide a functional, accessible mobile navigation pattern (e.g., a hamburger menu that opens a drawer). The navigation links themselves should be powered by a content collection (as hinted at in the Header.astro example), which the user will populate.

4.05 & 4.10: Essential Page Routes: Implement index.astro and 404.astro only. This makes the template runnable out-of-the-box. A minimal homepage demonstrates component usage, and a custom 404 page is a best practice. The user will be responsible for creating all other pages.

4.07: Font Loading: Implement. Configure @fontsource with a sensible default (like Inter) and include the <link rel="preload"> tags in the BaseLayout. This establishes the performance pattern, and the user can easily swap the font package later.

4.08: Security Headers: Implement. Provide a strong, secure default public/_headers file. This is a critical production-readiness feature that many developers overlook.

4.09: Skip Links: Implement. A SkipLink.astro component should be included and integrated into BaseLayout.astro as a non-negotiable accessibility feature.

## Phase 4 Implementation Plan: Building the Template Skeleton

This plan will systematically construct the foundational elements of the template, following the blueprint laid out in your implementation guide.

### Strategic Approach

Structure First: We will create the necessary directories and files, establishing the project's architecture.
Component-Driven: We will build the core layout, header, and footer as reusable Astro components.
Best Practices by Default: We will integrate performance optimizations (font preloading), accessibility features (skip links), and security (headers) from the very beginning.
Minimal & Runnable: The end goal of this phase is a minimal, runnable Astro project that serves as a solid foundation for all future development.
Detailed Implementation Steps
This is the proposed sequence of work. Each step corresponds directly to the tasks in the Phase 4 - Skeleton Layout & Routing guide.

1. Foundational Directories & Layout (Steps 4.01, 4.06, 4.07)

    Action: Create the core layouts directory and the main BaseLayout.astro component. This file is the heart of the template.
    Files to Create:
        src/layouts/BaseLayout.astro
    Key Features:
    A robust Props interface for SEO metadata (title, description, image, canonicalURL).
    Complete *head* section with all required meta tags (Open Graph, Twitter Cards).
    Integration of @fontsource-variable/inter for typography.
    <link rel="preload"> tags for WOFF2 font files to optimize loading.
    Placeholders for Header, Footer, SkipLink, and the main content slot.
    ViewTransitions component for smooth navigation.

2. Essential Page Routes (Steps 4.05, 4.10)

    Action: Create the pages directory and add the minimal set of pages to make the template runnable and user-friendly.
    Files to Create:
        src/pages/index.astro
        src/pages/404.astro
        src/pages/500.astro (as a best practice)
    Key Features:
    Each page will use BaseLayout.
    index.astro will contain simple placeholder content.
    404.astro and 500.astro will provide clear, styled error messages as per the guide's examples.

3. Structural Components (Steps 4.02, 4.03, 4.04)

    Action: Build the main structural components for the layout, following the atomic design principles outlined in your project rules.
    Files to Create:
        src/components/structural/Header.astro
        src/components/structural/Footer.astro
        src/components/structural/MobileMenu.astro
        src/components/islands/MobileMenuIsland.tsx (The interactive part, establishing the progressive enhancement pattern).
    Key Features:
        Clean, semantic HTML structure.
        Placeholders for logo, navigation links (to be powered by a content collection later), and theme toggle.
        An accessible mobile navigation pattern.

4. Accessibility & Security (Steps 4.08, 4.09)

    Action: Implement critical accessibility and security features that should be part of any production-ready web application.
    Files to Create:
        src/components/a11y/SkipLink.astro
        public/_headers
        public/robots.txt
    Key Features:
        The SkipLink will be integrated into BaseLayout.astro.

    The _headers file will be populated with a strong Content Security Policy (CSP) and other security best practices.
        robots.txt will provide a sensible default for web crawlers.

5. Public Assets & Final Touches

    Action: Add the remaining public assets.
    Files to Create/Copy:
        public/favicon.svg (and other variants like .ico and apple-touch-icon.png)
    Key Features:
        Ensures the site has a professional appearance in browser tabs and when saved.

6. Performance Baseline (Step 4.12)

    Action: Create the script to measure performance, but defer running it until the end of the phase.
    File to Create:
        scripts/baseline-performance.ts
    Key Features:
        This script will provide our initial Lighthouse scores, which we will use as a benchmark for all future work.

This plan covers all non-optional items in the Phase 4 guide and directly addresses the gaps identified in the audit. The result will be a lean, powerful, and unopinionated template foundation.

Please review this plan. If you approve, I will begin with the first step: creating the foundational directories and the BaseLayout.astro component.
