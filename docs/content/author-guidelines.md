---
title: Content Authoring Guidelines
description: How to create and manage content for the Astro Performance Starter template.
---

# Content Authoring Guidelines

This document provides guidelines for creating and managing content within this project. Adhering to these guidelines ensures consistency, quality, and optimal performance.

## Getting Started

- **Content Location**: All content is stored in `src/content/` within respective collection subdirectories (`blog`, `projects`, `bio`, `navigation`).
- **Validation**: Before committing any content changes, please run `pnpm run check` to validate frontmatter and ensure type safety.

## Content Collections Overview

*(This section will be expanded to detail each collection, its purpose, and specific field requirements.)*

### 1. Blog (`src/content/blog/`)
   - Used for articles, tutorials, and updates.
   - Files are `.mdx`.
   - Key frontmatter: `title`, `description`, `publishDate`, `author`, `tags`, `category`, `featuredImage`, `draft`.

### 2. Projects (`src/content/projects/`)
   - Used for portfolio case studies.
   - Files are `.mdx`.
   - Key frontmatter: `title`, `description`, `publishDate`, `client`, `tags`, `featuredImage`, `status`, `draft`.

### 3. Bio (`src/content/bio/`)
   - Used for author profiles.
   - Files are `.json` (e.g., `author.json`).
   - Key fields: `name`, `title`, `email`, `avatar`, `social`, `bioShort`, `bioLong`.

### 4. Navigation (`src/content/navigation/`)
   - Used for site navigation data (e.g., header, footer).
   - Files are `.json` (e.g., `header.json`).
   - Key fields: `name`, `links` (array of `text`, `href`, `order`).

## Using MDX Components

*(This section will be expanded with examples for each custom MDX component: `Figure`, `Grid`, `Callout`, `Link`, `Blockquote`.)*

## Image Guidelines

*(This section will be expanded to cover image naming, dimensions, optimization, and placement.)*

## Draft and Review Process

*(This section will be expanded to detail the workflow for creating drafts, submitting for review, and publishing content.)*

---

*This document is a work in progress and will be updated with more detailed guidelines.*
