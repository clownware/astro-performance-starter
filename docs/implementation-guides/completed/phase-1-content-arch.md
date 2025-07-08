---
title: 'Phase 1 - Content & Data Architecture'
description: Establish content and data architecture for your project
lastUpdated: 2025-06-10T00:00:00.000Z
tableOfContents: true
pagefind: true
---
<Badge variant="success">Done</Badge>

## Overview

- **Track**: Both (MVP & Showcase)
- **Duration**: 1-2 days
- **Dependencies**: Phase 0 (Foundation) completed
- **Deliverables**: Content schema, TypeScript types, URL strategy, content fixtures

## Entry Criteria

- \[x] Astro project initialized
- \[x] TypeScript configured in strict mode
- \[x] Development environment functional
- \[x] Content requirements gathered

## Implementation Steps

| Step | Task | MVP | Showcase | Notes |
|------|------|-----|----------|-------|
| 1.01 | Inventory content types | ✅ | ✅ | List all content needs |
| 1.02 | Design URL structure | ✅ | ✅ | SEO-friendly paths |
| 1.03 | Create content collections | ✅ | ✅ | Define in config.ts |
| 1.04 | Define collection schemas | ✅ | ✅ | Zod schemas |
| 1.05 | Add draft mechanism | ✅ | ✅ | Boolean field |
| 1.06 | Generate TypeScript types | ✅ | ✅ | Auto from schemas |
| 1.07 | Create slug utilities | ✅ | ✅ | Consistent URL generation |
| 1.08 | Set up MDX components | ✅ | ✅ | Custom elements |
| 1.09 | Create content fixtures | ✅ | ✅ | One per type |
| 1.10 | Add frontmatter validation | ✅ | ✅ | astro check |
| 1.11 | Document content model | ✅ | ✅ | CHANGELOG.md |
| 1.12 | Create content guidelines | ✅ | ✅ | For authors |

## Common Pitfalls

1. **Overly Complex Schemas**: Starting with too many fields
   - **Solution**: Add fields as needed, start minimal

2. **Missing Draft Field**: Accidentally publishing unfinished content
   - **Solution**: Make draft:true the default, explicitly set to false

3. **Inconsistent Slugs**: URLs that change breaking links
   - **Solution**: Generate slugs once, store in frontmatter

4. **Type Mismatches**: Schema doesn't match actual content
   - **Solution**: Use fixtures to test schemas early

## Exit Criteria

- \[x] All content types identified and documented
- \[x] URL structure defined and consistent
- \[x] Content collections configured with schemas
- \[x] TypeScript types generating correctly
- \[x] Draft mechanism implemented and tested
- \[x] Slug generation utilities working
- \[x] MDX components configured
- \[x] At least one fixture per content type
- \[x] Validation passing with `astro check`
- \[x] Content model changelog created
- \[x] Author guidelines documented

## Rollback Strategy

If content architecture needs changes:

1. **Schema Changes**:

   ```bash
   # Create migration script
   node scripts/migrate-content.js --from v1 --to v2
   ```

2. **URL Structure Changes**:
   - Set up redirects in `astro.config.mjs`
   - Update all internal links
   - Submit new sitemap

3. **Collection Rename**:
   - Move files to new location
   - Update imports
   - Clear `.astro` cache

## AI Assistant Notes

### Key Files to Reference

- `src/content/config.ts` - Collection schemas
- `src/utils/url-utils.ts` - URL patterns
- `src/content/*/` - Content examples
- Content model changelog

### Common Prompts for This Phase

- "Create Astro content collection schema for \[type]"
- "Generate TypeScript types from content schema"
- "Set up MDX components for rich content"
- "Create URL structure for SEO"

### Context Requirements

- Types of content (blog, portfolio, etc.)
- URL preferences (with/without dates)
- Required metadata fields
- Future content plans

## References

- [Astro Content Collections Documentation](https://docs.astro.build/en/guides/content-collections/)
- [Zod Schema Validation](https://github.com/colinhacks/zod)
- [SEO-Friendly URL Structure Best Practices](https://developers.google.com/search/docs/crawling-indexing/url-structure)

---
Return to [Phase 0: Foundation Decisions](/implementation-guides/01-foundation-phase-0-foundation/) | Proceed to [Phase 2: Design System Tokens](/implementation-guides/02-structure-phase-2-design-system/)
