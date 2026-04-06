---
title: Phase 2 - Design System & Tokens
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Covers design tokens, Tailwind configuration, CSS architecture, and
  accessibility primitives — Foundation tier, essential for all projects
tableOfContents: true
pagefind: true
---

## Overview

- **Tier**: Foundation (Phase 2 of 12)
- **Duration**: 1-2 days
- **Dependencies**: Phase 0-1 completed
- **Deliverables**: Design tokens, Tailwind config, CSS architecture, accessibility primitives

## Entry Criteria

- [x] Content architecture defined
- [x] TypeScript configured
- [x] Tailwind CSS installed
- [x] Design requirements gathered

## Implementation Steps

| Step | Task | Scope | Notes |
|------|------|-------|-------|
| 2.01 | Define color palette | Essential | HSL for flexibility |
| 2.02 | Set up typography scale | Essential | Fluid type optional |
| 2.03 | Create spacing system | Essential | Consistent scale |
| 2.04 | Define radius tokens | Essential | Border radius system |
| 2.05 | Add shadow system | Essential | Elevation tokens |
| 2.06 | Create motion tokens | Essential | Transitions/animations (ensure surfaced in tailwind.config.ts for utility classes like transition-base, duration-fast, etc.) |
| 2.07 | Set up dark mode | Essential | CSS variables approach |
| 2.08 | Add a11y primitives | Essential | Focus, contrast |
| 2.09 | Configure Tailwind | Essential | Extend with tokens |
| 2.10 | Create token build | Essential | JSON to CSS/Tailwind |
| 2.11 | Document usage | Essential | Guidelines for devs |
| 2.12 | Add WCAG checks | Essential | Script to iterate all semantic text/background pairs for WCAG AA |

### Tailwind CSS Considerations

Tailwind CSS is now stable and provides significant improvements over v3, including better performance, enhanced design token integration, and improved developer experience.

**Key v4.2.2 Benefits:**

- **Better Performance**: Faster build times and smaller CSS output
- **Enhanced Design Tokens**: Native CSS variables support
- **Improved DX**: Better IDE support and error messages
- **Migration Path**: Clear upgrade path from v3 configurations

**Current Implementation:**
The project uses `tailwindcss: "^4.2.2"` which ensures you get the latest stable v4 patches while maintaining compatibility.

### Image Optimization and Future Scalability

**Current Approach:**
The project currently leverages Astro's built-in `<Image>` component for image optimization. This component, often paired with the Sharp.js library under the hood (as per default Astro configurations), handles tasks like resizing, format conversion (e.g., to AVIF, WebP), and generating responsive `srcset` attributes. This is generally sufficient for optimal performance and image handling at the current scale.

**Future Consideration: Image CDN Fallback/Enhancement**
While the built-in solution is robust, if the project experiences a significant spike in traffic, or if the requirements for delivering numerous device-specific image variants become more complex, integrating a dedicated image CDN should be considered.

Services like **Cloudflare Images** (or similar offerings like Cloudinary, Imgix) provide benefits such as:

- **Real-time Resizing and Optimization**: Images can be transformed on-the-fly based on request parameters or device characteristics, reducing the need to pre-generate all variants.
- **Global CDN Delivery**: Faster image delivery worldwide.
- **Advanced Features**: Watermarking, format negotiation, and more sophisticated art direction capabilities.

This is not an immediate requirement but a potential future enhancement to keep in mind for scalability and advanced image manipulation needs. The decision to integrate such a service would involve cost considerations and a re-evaluation of the image delivery pipeline.

## Common Pitfalls

1. **Hardcoded Colors**: Using hex values directly in components
   - **Solution**: Always use token classes or CSS variables

2. **Missing Dark Mode**: Not considering dark mode from start
   - **Solution**: Use semantic tokens that work in both modes

3. **Poor Contrast**: Not validating WCAG compliance
   - **Solution**: Run contrast checks on all color combinations

4. **Motion Sickness**: Not respecting prefers-reduced-motion
   - **Solution**: Add motion guards in global CSS

## Exit Criteria

- [x] Color palette defined with semantic naming
- [x] Typography scale configured
- [x] Spacing system consistent
- [x] Border radius tokens defined
- [x] Shadow system created
- [x] Motion tokens established
- [x] Dark mode functioning
- [x] Accessibility utilities created
- [x] Tailwind extended with tokens
- [x] Token build script working
- [x] WCAG contrast validated
- [x] Usage guidelines documented

## Rollback Strategy

If design system needs major changes:

1. **Token Updates**:

   ```bash
   # Keep old tokens
   cp tokens/base.json tokens/base.json.backup
   # Test new tokens
   pnpm run tokens:build # Note: You'll need to create the './scripts/build-tokens.js' file as part of this phase.
   # Validate contrast
   pnpm run design:validate
   ```

2. **Tailwind Config Issues**:
   - Revert tailwind.config.ts
   - Clear Tailwind cache
   - Rebuild CSS

3. **Breaking Changes**:
   - Use CSS variables for gradual migration
   - Keep old classes temporarily
   - Document deprecations

## AI Assistant Notes

### Key Files to Reference

- `tokens/base.json` - Core design tokens
- `tailwind.config.ts` - Tailwind configuration
- `src/styles/global.css` - Global styles
- Token build script

### Common Prompts for This Phase

- "Create accessible color palette with WCAG AA compliance"
- "Set up Tailwind with design tokens"
- "Implement dark mode with CSS variables"
- "Create fluid typography scale"

### Context Requirements

- Brand colors if any
- Typography preferences
- Motion preferences
- Accessibility requirements
