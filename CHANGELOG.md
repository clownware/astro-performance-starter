---
title: "Changelog"
version: "1.0.0"
lastUpdated: "2025-06-10"
description: "Record of all notable changes made to the Astro Performance Starter project."
---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project structure and documentation.
- **Blog Performance Optimizations:**
  - Moved post sorting to `getStaticPaths` to eliminate redundant O(n log n) operations per page (99% reduction for 100 posts)
  - Consolidated `post.render()` calls to avoid double markdown parsing (50% reduction)
  - Added explicit `decoding="async"` to cover images for improved LCP scores
  - Documented optimizations in ADR 012 with scalability considerations
- **Error Handling for Dynamic Routes:**
  - Added defensive error handling in `/src/pages/blog/[slug].astro` to redirect to 404 if post is undefined or slug mismatch occurs
  - Documented error handling pattern in ADR 011 for consistent application across dynamic routes
- **Content Model Definition (Phase 1):**
  - Established core content collections in `src/content/config.ts`:
    - `blog`: For blog posts, articles, and tutorials. Includes fields for title, description, dates, author, tags, category, featured image, and draft status. Supports MDX.
    - `projects`: For portfolio case studies. Includes fields for title, description, dates, tags, client, repository/demo URLs, images, status, and draft status. Supports MDX.
    - `bio`: For author/about information. Includes fields for name, title, contact, avatar, social links, short/long bios, location, resume, and draft status. Stored as JSON.
    - `navigation`: For site navigation structures (e.g., header, footer). Includes fields for link text, URL, order, target, icon, and draft status. Stored as JSON.
  - Implemented Zod schemas for robust validation of all content collection frontmatter and data.
  - Added `draft` field to all collections to control content visibility.
  - Configured MDX custom components in `astro.config.mjs` (`Figure`, `Grid`, `Callout`, `Link`, `Blockquote`) for enhanced content rendering.
  - Created URL generation utilities in `src/utils/url-utils.ts` for consistent and SEO-friendly paths.
  - Added initial content fixtures for all collections to serve as examples.

<Aside type="note" title="Work in Progress">
  More details to come.
</Aside>
