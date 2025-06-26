---
title: Link Migration Guide
description: "> **Solution for Issue #6**: Converting hard-coded relative links to build-time validated references\r"
---
# Link Migration Guide

> **Solution for Issue #6**: Converting hard-coded relative links to build-time validated references

## Problem

Documentation contains hard-coded relative links like `](./implementation-guides/...)` that will break when files move between `docs/` ↔ `src/content/` during content collection migration.

## Solution

We've implemented **build-time link validation** using a remark plugin that:

1. ✅ **Validates all internal links at build time** - build fails if links are broken
2. ✅ **Supports both relative and absolute references** - `./file.md` and `/docs/file.md`
3. ✅ **Prepares for Content Collections** - seamless migration to `src/content/`
4. ✅ **Zero runtime overhead** - validation happens during build only

## Link Formats Supported

### Current (Relative Links)
```markdown
[Phase 0](./implementation-guides/01-foundation-phase-0-foundation.md)
[ADR Template](./adr/template.md)
[Track Comparison](../tracks/track-comparison.md)
```

### Future-Ready (Absolute References)
```markdown
[Phase 0](/docs/implementation-guides/01-foundation-phase-0-foundation.md)
[ADR Template](/docs/adr/template.md)
[Track Comparison](/docs/tracks/track-comparison.md)
```

### Content Collections (Future)
```markdown
[Phase 0](/docs/foundation/phase-0)
[ADR Template](/docs/adr/template)
[Track Comparison](/docs/tracks/comparison)
```

## Migration Steps

### Phase 1: Enable Link Validation (✅ Complete)

1. **Added remark plugin** - `scripts/remark-validate-links.mjs`
2. **Updated Astro config** - validates links during build
3. **Added validation script** - `pnpm run validate:links`

### Phase 2: Convert to Absolute References (Optional)

To prepare for content collections, convert relative links to absolute:

```bash
# Find all relative links
grep -r "](\./" docs/ --include="*.md"

# Example conversions:
# Before: [Phase 0](./implementation-guides/01-foundation-phase-0-foundation.md)
# After:  [Phase 0](/docs/implementation-guides/01-foundation-phase-0-foundation.md)
```

### Phase 3: Content Collections Migration (Future)

When migrating to `src/content/docs/`:

1. **Move files**: `docs/` → `src/content/docs/`
2. **Update config**: Add content collection schema
3. **Links auto-work**: Absolute references validated against new location

## How It Works

### Build-Time Validation

The remark plugin (`remarkValidateLinks`) processes all `.md` and `.mdx` files during build:

```javascript
// astro.config.mjs
remarkPlugins: [
  [remarkValidateLinks, { 
    rootDir: process.cwd(),
    basePaths: ['/docs', '/src/content'],  // Search paths
    strict: true  // Fail build on broken links
  }]
]
```

### Link Resolution Priority

1. **Absolute paths**: `/docs/file.md` → `${rootDir}/docs/file.md`
2. **Relative paths**: `./file.md` → `${currentDir}/file.md`
3. **Extension inference**: `./file` → `./file.md` (with warning)

### Error Examples

```bash
# Build fails with helpful errors:
Link validation failed:
docs/README.md:37 - Broken internal link: ./missing-file.md
docs/README.md:45 - Broken internal link: ./implementation-guides/nonexistent.md

# Suggestions for improvements:
Link validation suggestions:
  docs/README.md:52 - Consider adding .md extension to link: ./ROADMAP → ./ROADMAP.md
```

## Testing Link Validation

### Manual Testing
```bash
# Validate all links during build
pnpm run validate:links

# Full build with link validation
pnpm run build
```

### Automated Testing
```bash
# CI pipeline includes link validation
# .github/workflows/ci.yml already runs pnpm run build
```

### Create Test Cases
```bash
# Create an intentionally broken link to test
echo "[Broken Link](./this-file-does-not-exist.md)" >> docs/test-broken-link.md
pnpm run validate:links  # Should fail

# Remove test file
rm docs/test-broken-link.md
```

## Configuration Options

### Strict Mode (Recommended)
```javascript
[remarkValidateLinks, { 
  strict: true  // Fail build on any broken link
}]
```

### Lenient Mode (Development)
```javascript
[remarkValidateLinks, { 
  strict: false  // Log warnings but don't fail build
}]
```

### Custom Base Paths
```javascript
[remarkValidateLinks, { 
  basePaths: ['/docs', '/src/content', '/public']
}]
```

## Benefits

### Immediate
- ✅ **Catch broken links at build time** - no more 404s in production
- ✅ **Prevent documentation debt** - forces link maintenance
- ✅ **Better developer experience** - clear error messages

### Future-Proofing
- ✅ **Content Collections ready** - seamless migration path
- ✅ **File reorganization safe** - absolute links won't break
- ✅ **Scalable documentation** - works with any file structure

## Rollback Strategy

If issues arise, disable link validation:

```javascript
// astro.config.mjs - comment out the plugin
remarkPlugins: [
  [remarkInjectVersions, { rootDir: process.cwd() }],
  // [remarkValidateLinks, { ... }]  // Disabled
]
```

All existing relative links will continue working as before.

## Next Steps

1. **Test the validation** - `pnpm run validate:links`
2. **Fix any broken links** found during validation
3. **Optional**: Convert to absolute references for future-proofing
4. **Consider**: Adding anchor validation for section links

---

**Related**:
- [Architecture Decision: Link Validation Strategy](./adr/005-link-validation.md) (TODO)
- [Content Collections Migration Guide](./CONTENT-COLLECTIONS-MIGRATION.md) (TODO)
