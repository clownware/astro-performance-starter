# ADR 010: Social Share URL Generation Utility

**Status:** Accepted  
**Date:** 2025-09-30  
**Deciders:** Development Team  
**Related:** Blog Layout Enhancements, DRY Principle

## Context

Social sharing URLs were previously generated inline within `BlogLayout.astro`, leading to:

- Code duplication risk when adding sharing to other pages (projects, case studies)
- Inconsistent URL encoding across different implementations
- Lack of unit test coverage for URL generation logic
- Difficulty maintaining platform-specific URL formats

## Decision

Extract social share URL generation into a dedicated utility module at `src/utils/socialShare.ts` with:

1. **Type-safe platform definitions**: `SharePlatform` type for supported platforms
2. **Consistent encoding**: All URLs use `encodeURIComponent()` for safety
3. **Flexible API**: Both single-platform and multi-platform generation functions
4. **Comprehensive testing**: Unit tests covering edge cases and special characters

### API Design

```typescript
// Generate single platform URL
generateShareUrl(platform: SharePlatform, options: ShareUrlOptions): string

// Generate all platform URLs
generateAllShareUrls(options: ShareUrlOptions): Record<SharePlatform, string>
```

### Supported Platforms

- Twitter (X)
- LinkedIn
- Facebook
- Reddit
- Email (mailto)

## Implementation

**Before** (`BlogLayout.astro`):

```
```typescript
const encodedTitle = encodeURIComponent(title);
const encodedUrl = encodeURIComponent(currentUrl);

const shareUrls = {
  twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
};
```

**After**:

```
```typescript
import { generateAllShareUrls } from "@utils/socialShare";

const shareUrls = generateAllShareUrls({
  url: currentUrl,
  title,
  description,
});
```

## Consequences

### Positive

- ✅ **DRY Principle**: Single source of truth for share URL generation
- ✅ **Reusability**: Can be used in blog posts, projects, case studies, etc.
- ✅ **Testability**: 11 unit tests covering edge cases and encoding
- ✅ **Maintainability**: Platform URL changes only need updates in one place
- ✅ **Type Safety**: TypeScript ensures valid platform names
- ✅ **Security**: Consistent `encodeURIComponent()` usage prevents XSS

### Neutral

- Platform-specific URL formats are centralized (easier to update, but requires utility changes)

### Negative

- None identified - this is a pure improvement following DRY principles

## Compliance

- **User Rules**: ✅ Follows "action-object" naming pattern (`generateShareUrl`)
- **User Rules**: ✅ Uses TypeScript strict mode with proper interfaces
- **User Rules**: ✅ Includes comprehensive unit tests
- **User Rules**: ✅ Uses semantic naming conventions
- **Performance**: ✅ Zero runtime overhead (compile-time only)

## Related Files

- `src/utils/socialShare.ts` - Utility implementation
- `src/utils/__tests__/socialShare.test.ts` - Unit tests
- `src/layouts/BlogLayout.astro` - Primary consumer
- `src/pages/projects/[slug].astro` - Potential future consumer

## Future Considerations

- Add support for additional platforms (WhatsApp, Telegram, etc.)
- Consider adding analytics tracking parameters to share URLs
- Explore server-side share count APIs if needed
