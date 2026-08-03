---
title: 'ADR-017: Experience Content Collection'
lastUpdated: 2025-10-01T00:00:00.000Z
description: >-
  Create an experience content collection to manage work history data with
  type-safe Zod schemas and MDX support for rich descriptions
tableOfContents: true
pagefind: true
---

## Status

Superseded by [ADR-027: Content Collections Schema Design](./027-content-collections-schema-design.md), which provides the comprehensive schema design for the five collections it covers (a sixth collection, `adr`, was added to `src/content.config.ts` later). This ADR remains the rationale for creating the experience collection.

## Context

The `about.astro` page previously hardcoded work experience data in the frontmatter, which:

- Violated DRY principles if experience data needed to be reused (e.g., resume page, homepage)
- Made it difficult to manage rich content (descriptions, achievements)
- Didn't leverage Astro's Content Collections API for type safety and validation

## Decision

We will create an `experience` content collection to manage work history data:

1. **Collection Type**: `content` (supports MDX for rich descriptions)
2. **Schema**: Includes title, company, dates, description, highlights, technologies
3. **Usage**: Optional - can be used on about page or kept as hardcoded data for simplicity

### Schema Design

```typescript
const experienceCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    company: z.string(),
    location: z.string().optional(),
    startDate: z.date(),
    endDate: z.date().optional(), // Optional for current positions
    current: z.boolean().default(false),
    description: z.string(),
    highlights: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
    order: z.number().default(0), // For manual ordering
  }),
});
```

## Usage Example

### Option 1: Use Content Collection (Recommended for Reusability)

```astro
---
import { getCollection } from 'astro:content';

const experiences = await getCollection('experience');
const sortedExperiences = experiences
  .sort((a, b) => a.data.order - b.data.order);
---

{sortedExperiences.map((exp) => (
  <article>
    <h3>{exp.data.title}</h3>
    <p>{exp.data.company}</p>
    <p>{exp.data.description}</p>
  </article>
))}
```

### Option 2: Keep Hardcoded (Acceptable for Single Use)

If experience data is ONLY used on the about page and won't be reused elsewhere, hardcoded data is acceptable per YAGNI principle.

## Consequences

### Positive

- **Type Safety**: Zod schema validation ensures data integrity
- **Reusability**: Experience data can be used across multiple pages
- **Rich Content**: MDX support allows detailed descriptions with formatting
- **Maintainability**: Separate content files are easier to manage than frontmatter
- **Flexibility**: Can add fields (e.g., company logo, links) without code changes

### Negative

- **Complexity**: Adds overhead if only used in one place
- **Build Time**: Slight increase in build time for content processing

### Neutral

- **Migration**: Existing hardcoded data can remain until reuse is needed
- **Backward Compatible**: Both approaches can coexist

## Implementation Notes

1. **Date Formatting**: Use helper functions to format dates (e.g., "2022 - Present")
2. **Ordering**: Use `order` field for manual sorting (lower numbers first)
3. **Current Position**: Use `current: true` and omit `endDate` for current roles
4. **Technologies**: Store as array for Badge component rendering

## Related ADRs

- ADR 000: Starter Decisions (Content Collections usage)
- ADR 003: Unified Component Structure (atomic design pattern; the planned "ADR-016:
  Badge Component" was never written — see the [016 stub](./016-reserved.md))

## References

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Zod Schema Validation](https://zod.dev/)

---
**Date**: 2025-10-01 (footer backfilled 2026-07-05 from git history; this record predates the footer convention)\
**Participants**: Template maintainers\
**Outcome**: Superseded by ADR-027
