---
title: 'Phase 7 - Content'
description: Develop high-quality content and ensure it aligns with performance goals
lastUpdated: 2024-01-15T00:00:00.000Z
tableOfContents: true
pagefind: true
---
*What performance challenges are you facing? I'd love to hear about your optimization wins and struggles. [Reach out on Twitter](https://twitter.com/yourusername) or [email me](/implementation-guides/mailto:your@email/).*

## Overview

- **Tier**: Build (Phase 7 of 12)
- **Duration**: 3-5 days
- **Dependencies**: Phase 0-6 completed
- **Deliverables**: Written content, optimized images, meta descriptions, content fixtures

## Entry Criteria

- \[ ] Content architecture defined (Phase 1)
- \[ ] Page sections built (Phase 6)
- \[ ] Image optimization pipeline ready
- \[ ] Content schemas validated

## Implementation Steps

| Step | Task | Scope | Notes |
|------|------|-------|-------|
| 7.01 | Write homepage content | Essential | Focus on clarity |
| 7.02 | Create about content | Essential | Personal or company |
| 7.03 | Write project case studies | Essential | 3-5 detailed examples |
| 7.04 | Create blog posts | Essential | 3-5 starter posts |
| 7.05 | Optimize all images | Essential | AVIF/WebP formats |
| 7.06 | Write meta descriptions | Essential | SEO optimization |
| 7.07 | Create navigation content | Essential | Menu items, footer |
| 7.08 | Add legal pages | Essential | Privacy, terms |
| 7.09 | Create 404 content | Essential | Helpful error page |
| 7.10 | Generate OG images | Essential | Social sharing |
| 7.11 | Write microcopy | Recommended | UI text, tooltips |
| 7.12 | Create email templates | Advanced | Contact responses |

## Content Strategy

### 1. Voice and Tone Guidelines

```markdown
# Content Style Guide

## Voice Attributes
- **Professional** but approachable
- **Clear** and concise
- **Helpful** and informative
- **Confident** without arrogance

## Tone Variations
- **Homepage**: Welcoming and inspiring
- **About**: Personal and authentic  
- **Projects**: Professional and results-focused
- **Blog**: Educational and conversational
- **Error Pages**: Helpful and human

## Writing Principles
1. **Lead with benefits**, not features
2. **Use active voice** whenever possible
3. **Break up long paragraphs** (3-4 sentences max)
4. **Include calls-to-action** that guide next steps
5. **Write scannable content** with headers and lists
```

### 2. SEO Content Checklist

```markdown
# SEO Content Checklist

For each page:
- [ ] Unique, descriptive title (50-60 characters)
- [ ] Meta description (150-160 characters)
- [ ] H1 tag with primary keyword
- [ ] Semantic heading hierarchy (H2, H3)
- [ ] Internal links to related content
- [ ] Image alt text describes content
- [ ] URL slug matches content focus
- [ ] Schema markup where applicable

For blog posts:
- [ ] Focus keyword in title, H1, first paragraph
- [ ] Related keywords naturally included
- [ ] Minimum 300 words (prefer 800+)
- [ ] External links to authoritative sources
- [ ] Categories and tags assigned
- [ ] Author bio included
```

## Future-Proofing Your Performance

### 1. Prepare for Mobile-First Indexing

- Test on real devices, not just DevTools
- Optimize for 3G connections
- Consider data saver preferences

### 2. Embrace Progressive Enhancement

- Start with HTML that works
- Layer on CSS enhancements
- Add JavaScript as final enhancement

### 3. Invest in Infrastructure

- CDN with edge computing capabilities
- Automated performance testing
- Real user monitoring

## Key Takeaways for Performance

1. **INP is the new FID** - Optimize for entire interactions
2. **Edge computing is mainstream** - Move logic closer to users
3. **Islands architecture works** - Ship less JavaScript
4. **Performance budgets need context** - Tie to business metrics
5. **Monitoring is non-negotiable** - You can't improve what you don't measure

## What's Next?

Performance optimization is a journey, not a destination. Here are your next steps:

1. **Audit your current metrics** using Lighthouse
2. **Implement RUM** to understand real user experience
3. **Set performance budgets** based on business goals
4. **Create a performance culture** with automated testing

Remember: The fastest code is no code. Question every kilobyte.

## Common Pitfalls

1. **Keyword Stuffing**: Overusing keywords unnaturally
   - **Solution**: Write for humans first, optimize second

2. **Missing Alt Text**: Images without descriptions
   - **Solution**: Describe image content and function

3. **Duplicate Content**: Same content on multiple pages
   - **Solution**: Use canonical URLs, write unique content

4. **Slow Image Loading**: Unoptimized images hurting performance
   - **Solution**: Use responsive images with modern formats

5. **Generic Meta Descriptions**: Using same description everywhere
   - **Solution**: Write unique descriptions for each page

## Exit Criteria

### Essential (all projects)

- [ ] Homepage, About, Project case studies, Blog posts written
- [ ] All images optimized (AVIF/WebP)
- [ ] Meta descriptions for all pages
- [ ] Navigation structure finalized
- [ ] Legal pages created (Privacy, Terms)
- [ ] 404 page designed
- [ ] OG images generated

### Recommended (most projects)

- [ ] Microcopy documented (UI text, tooltips, empty states)

### Advanced (portfolio/enterprise)

- [ ] Email response templates created
- [ ] Content style guide documented

## Rollback Strategy

If content needs major revision:

1. **Content Issues**:
   - Keep original drafts in version control
   - A/B test different versions
   - Get feedback before full rollout

2. **Image Problems**:
   - Keep original high-res versions
   - Re-run optimization pipeline
   - Test on slow connections

3. **SEO Impact**:
   - Monitor search console
   - Keep old URLs with redirects
   - Update sitemap immediately

## AI Assistant Notes

### Key Files to Reference

- `src/content/*` - All content collections
- `src/assets/images/*` - Image assets
- Meta description templates
- Content style guide

### Common Prompts for This Phase

- "Write engaging homepage hero content"
- "Create SEO-optimized meta descriptions"
- "Generate project case study content"
- "Optimize images for web performance"

### Context Requirements

- Brand voice and tone
- Target audience
- Key differentiators
- SEO keywords (if any)
