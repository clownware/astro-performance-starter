---
title: 'ADR-027: Content Collections Schema Design'
lastUpdated: 2026-02-18T00:00:00.000Z
description: >-
  Documents the design decisions behind the five content collections (blog,
  projects, bio, experience, navigation), their schema fields, storage formats,
  and the rationale for each choice.
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

Astro's Content Collections API provides type-safe, schema-validated content management. The starter ships with five collections pre-configured in `src/content/config.ts`. These represent the most common content types for portfolio and small production sites — the primary audience for this template.

The schema design decisions are non-obvious and affect how users extend the template. Without documentation, users frequently ask: why these collections, why these fields, why JSON for some and MDX for others.

## Decision Drivers

- **Cover the common case**: A portfolio/small-site user should be able to ship without defining their own schemas
- **Type safety**: All fields must be validated with Zod at build time
- **Extensibility**: Schemas should be easy to extend without breaking existing content
- **Format appropriateness**: MDX for rich content, JSON for structured data
- **Draft support**: All content collections support a `draft` field to hide unpublished content

## Collections and Rationale

### `blog` — MDX content

**Purpose**: Blog posts, articles, tutorials

**Format**: MDX (`.mdx`) — rich content with embedded components

**Key schema decisions**:

| Field | Type | Rationale |
|-------|------|-----------|
| `title` | `string` | Required — used in `<title>`, OG tags, listing pages |
| `description` | `string` | Required — used in meta description and post cards |
| `publishDate` | `date` | Required — enables chronological sorting |
| `updatedDate` | `date` (optional) | Shows "last updated" for evergreen content |
| `author` | `string` (optional) | Defaults to site author from bio collection |
| `tags` | `string[]` (optional) | Enables tag-based filtering |
| `heroImage` | `image` (optional) | Astro image type — enables build-time optimisation |
| `draft` | `boolean` (default: false) | Excludes from production builds when true |

**Why `publishDate` not `date`?** Unambiguous and consistent with the `updatedDate` sibling field.

### `projects` — MDX content

**Purpose**: Portfolio case studies, project showcases

**Format**: MDX — projects benefit from rich narrative content with images

**Key schema decisions**:

| Field | Type | Rationale |
|-------|------|-----------|
| `title` | `string` | Required |
| `description` | `string` | Required — used in project cards and meta |
| `startDate` | `date` | Required — enables chronological ordering |
| `endDate` | `date` (optional) | Null = ongoing project |
| `tags` | `string[]` (optional) | Tech stack tags for filtering |
| `repoUrl` | `url` (optional) | GitHub/GitLab link |
| `demoUrl` | `url` (optional) | Live demo link |
| `heroImage` | `image` (optional) | Project cover image |
| `draft` | `boolean` (default: false) | |

**Why not a `featured` field?** Ordering is handled by `startDate` sort. "Featured" is a display concern handled at the page level, not a content concern.

### `bio` — JSON data

**Purpose**: Author/about information — name, contact, social links, short and long bios

**Format**: JSON (`.json`) — structured data with no narrative content; MDX would be overkill and harder to query programmatically

**Key schema decisions**:

| Field | Type | Rationale |
|-------|------|-----------|
| `name` | `string` | Required |
| `role` | `string` | Job title / professional descriptor |
| `shortBio` | `string` | 1-2 sentence summary for cards and meta |
| `avatar` | `image` (optional) | Astro image type for optimisation |
| `social` | `object` | Typed social link map (twitter, github, linkedin, etc.) |
| `email` | `string` (optional) | Contact email |
| `location` | `string` (optional) | City/region — no more specific for privacy |

**Why a collection not a config file?** Collections are type-safe and queryable via `getEntry()`. A plain config file would require a separate import pattern and has no Zod validation.

### `experience` — JSON data

**Purpose**: Work history / CV entries

**Format**: JSON — structured, tabular data; no rich content needed

**Key schema decisions**:

| Field | Type | Rationale |
|-------|------|-----------|
| `company` | `string` | Required |
| `role` | `string` | Required |
| `startDate` | `date` | Required — enables chronological sort |
| `endDate` | `date` (optional) | Null = current role |
| `description` | `string` | Brief summary of responsibilities |
| `highlights` | `string[]` (optional) | Bullet-point achievements |
| `technologies` | `string[]` (optional) | Tech stack used |

### `navigation` — JSON data

**Purpose**: Header and footer navigation link lists

**Format**: JSON — pure structured data; no content, no MDX needed

**Why a collection not hardcoded in components?** Separating navigation from component code means non-developers can update nav links without touching `.astro` files. It also enables type-safe validation of `href` values.

**Key schema decisions**:

| Field | Type | Rationale |
|-------|------|-----------|
| `text` | `string` | Link label |
| `href` | `string` | URL path or external URL |
| `external` | `boolean` (default: false) | Adds `target="_blank"` and `rel` attributes |

## Format Decision: MDX vs JSON

| Use MDX when... | Use JSON when... |
|-----------------|------------------|
| Content has narrative prose | Content is purely structured/tabular |
| Authors need to embed components | Data is queried programmatically |
| Content varies significantly between entries | All entries share identical shape |
| Rich text formatting is needed | Simple string/number/boolean fields only |

## Extending Schemas

To add a field to an existing collection:

1. Add the Zod field to `src/content/config.ts`
2. Make it optional with `.optional()` or provide a `.default()` to avoid breaking existing content files
3. Run `pnpm run check` to validate
4. Update existing content files if the field is required

To add a new collection:

1. Define the schema in `src/content/config.ts`
2. Create the directory `src/content/<name>/`
3. Add at least one content file
4. Run `pnpm run check` to confirm type generation

## Consequences

### Positive

- Users can ship a portfolio site without writing any schema code
- All content is type-safe — typos in frontmatter are caught at build time
- JSON collections are easily edited by non-developers
- Consistent `draft` pattern across all collections

### Negative

- Five pre-configured collections may feel opinionated for users with different content models
- JSON collections cannot contain rich text — users needing narrative bio content must switch to MDX

### Neutral

- Schemas should be treated as the source of truth for content shape; component props should derive from collection types, not duplicate them

## References

- [Astro Content Collections Documentation](https://docs.astro.build/en/guides/content-collections/)
- [Zod Documentation](https://zod.dev/)
- `src/content/config.ts` — authoritative schema definitions
- [ADR-017: Experience Content Collection](./017-experience-content-collection.md)

---
**Date**: 2026-02-18\
**Participants**: Template maintainers\
**Outcome**: Accepted
