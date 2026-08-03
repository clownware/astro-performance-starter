---
title: 'ADR-027: Content Collections Schema Design'
lastUpdated: 2026-02-18T00:00:00.000Z
description: >-
  Documents the design decisions behind the five original content collections
  (blog, projects, bio, experience, navigation), their schema fields, storage
  formats, and the rationale for each choice.
tableOfContents: true
pagefind: true
---

## Status

Accepted (amended 2026-08-02: collection count updated — ADR-062 added a sixth
collection, `adr`; the draft-support driver is scoped to `blog` and `projects`)

## Context

Astro's Content Collections API provides type-safe, schema-validated content management. The starter ships with six collections pre-configured in `src/content.config.ts` *(amended 2026-08-02: originally five — ADR-062 later added the `adr` collection, which publishes `docs/adr/` as web routes and is documented there)*. These represent the most common content types for portfolio and small production sites — the primary audience for this template.

The schema design decisions are non-obvious and affect how users extend the template. Without documentation, users frequently ask: why these collections, why these fields, why JSON for some and MDX for others.

## Decision Drivers

- **Cover the common case**: A portfolio/small-site user should be able to ship without defining their own schemas
- **Type safety**: All fields must be validated with Zod at build time
- **Extensibility**: Schemas should be easy to extend without breaking existing content
- **Format appropriateness**: MDX for rich content, JSON for structured data
- **Draft support**: All content collections support a `draft` field to hide unpublished content *(amended 2026-08-02: in practice only `blog` and `projects` carry `draft` — `bio`, `experience`, `navigation`, and `adr` have no draft field)*

## Collections and Rationale

### `blog` — MDX content

**Purpose**: Blog posts, articles, tutorials

**Format**: MDX (`.mdx`) — rich content with embedded components

**Key schema decisions**:

| Field | Type | Rationale |
|-------|------|-----------|
| `title` | `string` | Required — used in `<title>`, OG tags, listing pages |
| `description` | `string` | Required — used in meta description and post cards |
| `date` | `date` | Required — enables chronological sorting |
| `updated` | `date` (optional) | Shows "last updated" for evergreen content |
| `author` | `string` (default: "Your Name") | Defaults to placeholder — replace with your name |
| `tags` | `string[]` (default: `[]`) | Enables tag-based filtering |
| `technologies` | `string[]` (default: `[]`) | Tech stack used in post |
| `cover` | `image` (optional) | Astro image type — enables build-time optimisation |
| `coverAlt` | `string` | Required for accessibility when cover image is used |
| `cardImage` | `image` (optional) | Separate thumbnail for listing cards |
| `featured` | `boolean` (default: false) | Pins post to featured placement |
| `draft` | `boolean` (default: false) | Excludes from production builds when true |
| `readingTime` | `number` (optional) | Can be calculated automatically |
| `canonicalUrl` | `url` (optional) | For cross-posted content |
| `relatedPosts` | `string[]` (optional) | Slugs of related posts |

### `projects` — MDX content

**Purpose**: Portfolio case studies, project showcases

**Format**: MDX — projects benefit from rich narrative content with images

**Key schema decisions**:

| Field | Type | Rationale |
|-------|------|-----------|
| `title` | `string` | Required |
| `description` | `string` (max 160) | Required — used in project cards and meta description |
| `date` | `date` | Required — enables chronological ordering |
| `cover` | `image` | Required — project hero image |
| `coverAlt` | `string` | Required for accessibility |
| `tags` | `string[]` | Required — enables tag-based filtering |
| `technologies` | `string[]` | Required — tech stack used |
| `cardImage` | `image` (optional) | Separate thumbnail for listing cards |
| `featured` | `boolean` (default: false) | Pins project to featured placement |
| `draft` | `boolean` (default: false) | Excludes from production builds when true |
| `client` | `string` (optional) | Client name for case studies |
| `duration` | `string` (optional) | Project duration (e.g. "3 months") |
| `role` | `string` (optional) | Your role on the project |
| `outcomes` | `{metric, value, description?}[]` (optional) | Measurable results |
| `externalUrl` | `url` (optional) | Live project or case study link |
| `sortOrder` | `number` (default: 0) | Manual sort override |

### `bio` — MDX content

**Purpose**: Author/about information — name, contact, social links, and biography prose

**Format**: MDX (`.mdx`) — supports narrative bio content alongside structured data fields

**Key schema decisions**:

| Field | Type | Rationale |
|-------|------|-----------|
| `name` | `string` | Required |
| `title` | `string` | Job title / professional descriptor |
| `location` | `string` (optional) | City/region — no more specific for privacy |
| `avatar` | `image` | Astro image type for optimisation |
| `social` | `object` (optional) | Typed social link map (github, linkedin, twitter, email) |
| `skills` | `{category, items[]}[]` (optional) | Skill groups for about page display |

**Why a collection not a config file?** Collections are type-safe and queryable via `getEntry()`. A plain config file would require a separate import pattern and has no Zod validation.

### `experience` — MDX content

**Purpose**: Work history / CV entries

**Format**: MDX (`.mdx`) — supports rich descriptions alongside structured fields

**Key schema decisions**:

| Field | Type | Rationale |
|-------|------|-----------|
| `title` | `string` | Required — job title |
| `company` | `string` | Required |
| `location` | `string` (optional) | Office location |
| `startDate` | `date` | Required — enables chronological sort |
| `endDate` | `date` (optional) | Null = current role |
| `current` | `boolean` (default: false) | Flag for current position |
| `description` | `string` | Brief summary of responsibilities |
| `highlights` | `string[]` (optional) | Bullet-point achievements |
| `technologies` | `string[]` (optional) | Tech stack used |
| `order` | `number` (default: 0) | Manual sort override |

### `navigation` — JSON data

**Purpose**: Header and footer navigation link lists

**Format**: JSON — pure structured data; no content, no MDX needed

**Why a collection not hardcoded in components?** Separating navigation from component code means non-developers can update nav links without touching `.astro` files. It also enables type-safe validation of `href` values.

**Key schema decisions**:

| Field | Type | Rationale |
|-------|------|-----------|
| `label` | `string` | Link label |
| `href` | `string` | URL path or external URL |
| `isExternal` | `boolean` (default: false) | Adds `target="_blank"` and `rel` attributes |
| `icon` | `string` (optional) | Icon component name for navigation items |
| `order` | `number` (default: 0) | Controls display order |

## Format Decision: MDX vs JSON

| Use MDX when... | Use JSON when... |
|-----------------|------------------|
| Content has narrative prose | Content is purely structured/tabular |
| Authors need to embed components | Data is queried programmatically |
| Content varies significantly between entries | All entries share identical shape |
| Rich text formatting is needed | Simple string/number/boolean fields only |

## Extending Schemas

To add a field to an existing collection:

1. Add the Zod field to `src/content.config.ts`
2. Make it optional with `.optional()` or provide a `.default()` to avoid breaking existing content files
3. Run `pnpm run check` to validate
4. Update existing content files if the field is required

To add a new collection:

1. Define the schema in `src/content.config.ts`
2. Create the directory `src/content/<name>/`
3. Add at least one content file
4. Run `pnpm run check` to confirm type generation

## Consequences

### Positive

- Users can ship a portfolio site without writing any schema code
- All content is type-safe — typos in frontmatter are caught at build time
- JSON collections are easily edited by non-developers
- Consistent `draft` pattern across all collections *(amended 2026-08-02: `blog` and `projects` only)*

### Negative

- Five pre-configured collections may feel opinionated for users with different content models
- JSON collections cannot contain rich text — users needing narrative bio content must switch to MDX

### Neutral

- Schemas should be treated as the source of truth for content shape; component props should derive from collection types, not duplicate them

## References

- [Astro Content Collections Documentation](https://docs.astro.build/en/guides/content-collections/)
- [Zod Documentation](https://zod.dev/)
- `src/content.config.ts` — authoritative schema definitions
- [ADR-017: Experience Content Collection](./017-experience-content-collection.md) — ADR-017 introduced the experience collection specifically; this ADR (027) supersedes it by providing the comprehensive schema design for all five collections, including experience

---
This ADR supersedes [ADR-017](./017-experience-content-collection.md) for the experience collection schema. ADR-017 provided the initial rationale for creating the collection; the schema details here are authoritative.

---
**Date**: 2026-02-18\
**Participants**: Template maintainers\
**Outcome**: Accepted
