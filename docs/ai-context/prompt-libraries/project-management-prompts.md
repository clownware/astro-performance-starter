---
title: Project Management Prompt Templates
lastUpdated: 2025-06-10T00:00:00.000Z
description: Copy-paste prompts for documentation, troubleshooting, and project maintenance
tableOfContents: true
pagefind: true
---

> 🤖 **Purpose**: Copy-paste prompts for documentation, troubleshooting, migrations, and project maintenance

## Troubleshooting Prompts

### Debug Build Error

```text
Debug Astro build error:
- Error message: [paste error]
- When it occurs: [build/dev/preview]
- Recent changes: [list changes]
- Check: TypeScript errors, missing deps, schema issues
- Run: astro check, tsc --noEmit
- Verify content collections schema
- Check for circular dependencies

Reference our tooling setup in phase-3-tooling.md
```

### Performance Regression

```text
Investigate performance regression:
- Metric that regressed: [LCP, FID, CLS, etc.]
- When it started: [commit/date]
- Current value: [X]
- Previous value: [Y]
- Check: bundle sizes, image sizes, render-blocking resources
- Use: Lighthouse CI, bundle analyzer
- Compare with baseline in perf-baseline/

Follow rollback strategy from phase-9-performance.md
```

### Content Collection Issues

```text
Debug content collection problem:
- Collection name: [collection]
- Error type: [schema validation, build, type]
- Specific error: [paste error message]
- Check: Zod schema, frontmatter format, file structure
- Verify: Content file paths, schema exports
- Test: Individual file parsing

Reference content-collections.md for troubleshooting
```

## Migration Prompts

### Upgrade Dependencies

```text
Upgrade [Package] from [current] to [target]:
- Check breaking changes
- Update TypeScript types if needed
- Test all affected components
- Run full test suite
- Check bundle size impact
- Verify Lighthouse scores
- Update documentation
- Consider gradual rollout

Follow our dependency management guidelines
```

### Schema Migration

```text
Migrate content schema for [Collection]:
- Current schema: [describe]
- Target schema: [describe]
- Migration strategy: [approach]
- Handle existing content
- Provide fallbacks/defaults
- Test with sample content
- Create rollback plan
- Document in content changelog

See content migration patterns in content-collections.md
```

### Framework Version Update

```text
Update Astro from [current] to [target]:
- Review breaking changes in changelog
- Update astro.config.mjs if needed
- Check integration compatibility
- Test build and dev processes
- Update deployment configuration
- Verify all features still work
- Update documentation references

Reference phase-3-tooling.md for configuration
```

## Documentation Prompts

### Component Documentation

```text
Document [Component] following our standards:
- Purpose and use cases
- Props interface with descriptions
- Usage examples (2-3 variants)
- Accessibility features
- Performance considerations
- Common pitfalls
- Related components
- Add to Astrobook stories (Advanced scope only)

Follow documentation pattern from phase-5-components.md
```

### ADR Creation

```text
Create Architecture Decision Record for [Decision]:
- Context: [why this decision is needed]
- Options considered: [list 2-3 options]
- Decision: [what we chose]
- Consequences: [positive and negative]
- Implementation: [how to do it]
- Validation: [how to measure success]

Use ADR template from docs/adr/template.md
Number it sequentially (ADR-XXX)
```

### API Documentation

```text
Document [API/Integration] following our standards:
- Endpoint details and authentication
- Request/response examples
- Error handling patterns
- Rate limiting considerations
- TypeScript interfaces
- Testing approaches
- Environment configuration
- Monitoring and alerts

Reference integration patterns from phase-7-integrations.md
```

## Content Management Prompts

### Content Audit

```text
Audit content for [Section/Collection]:
- Current content inventory
- Quality assessment (accuracy, freshness)
- SEO optimization status
- Accessibility compliance
- Performance impact (images, videos)
- User engagement metrics
- Content gaps identified
- Recommended improvements

Reference content strategy from phase-1-content-arch.md
```

### Content Migration

```text
Migrate content from [Source] to [Target]:
- Content mapping strategy
- Field transformations needed
- Media file handling
- URL structure changes
- SEO preservation (redirects)
- Content validation process
- Rollback procedures
- Timeline and dependencies

Follow migration patterns from content-collections.md
```

### Editorial Workflow

```text
Set up editorial workflow for [Content Type]:
- Content creation process
- Review and approval stages
- Publishing schedule
- Quality standards
- Asset management
- SEO requirements
- Performance guidelines
- Maintenance procedures

Reference content management from phase-1-content-arch.md
```

## Deployment & Operations Prompts

### Deployment Setup

```text
Configure deployment for [Environment]:
- Build configuration
- Environment variables
- Domain and SSL setup
- CDN configuration
- Performance monitoring
- Error tracking
- Backup procedures
- Rollback strategy

Reference deployment guide from phase-12-launch.md
```

### Monitoring Setup

```text
Set up monitoring for [Metrics/Services]:
- Performance monitoring (Core Web Vitals)
- Error tracking and alerting
- Uptime monitoring
- Analytics configuration
- User feedback collection
- Business metrics tracking
- Dashboard creation
- Alert thresholds

Follow monitoring patterns from phase-11-analytics.md
```

### Security Audit

```text
Perform security audit for [Scope]:
- Dependency vulnerability scan
- Content Security Policy review
- Authentication/authorization check
- Input validation assessment
- HTTPS configuration
- Data privacy compliance
- Third-party integration security
- Incident response procedures

Reference security guidelines from phase-10-security.md
```

## Team Collaboration Prompts

### Code Review Guidance

```text
Review [Component/Feature] for:
- Code quality and consistency
- Performance implications
- Accessibility compliance
- Security considerations
- Testing coverage
- Documentation completeness
- Design system adherence
- Technical debt assessment

Follow review checklist from phase-3-tooling.md
```

### Onboarding Documentation

```text
Create onboarding guide for [Role/Team]:
- Project overview and context
- Development environment setup
- Key conventions and patterns
- Testing procedures
- Deployment process
- Communication channels
- Resource links
- Getting started tasks

Reference team guides from docs/team/
```

### Knowledge Transfer

```text
Document [Feature/System] for knowledge transfer:
- System architecture overview
- Key implementation decisions
- Dependencies and integrations
- Common issues and solutions
- Maintenance procedures
- Future roadmap considerations
- Contact information
- Related documentation

Use knowledge transfer template from docs/knowledge-base/
```

## Maintenance Prompts

### Dependency Updates

```text
Plan dependency update strategy:
- Current dependency audit
- Security vulnerability assessment
- Breaking change analysis
- Update prioritization
- Testing requirements
- Rollback procedures
- Timeline estimation
- Risk mitigation

Reference dependency management from phase-3-tooling.md
```

### Performance Optimization Review

```text
Conduct performance optimization review:
- Current performance metrics
- Bottleneck identification
- Optimization opportunities
- Implementation effort estimate
- Expected improvements
- Success measurement criteria
- Resource requirements
- Timeline planning

Follow optimization patterns from performance-patterns.md
```

### Technical Debt Assessment

```text
Assess technical debt in [Area/Component]:
- Current debt inventory
- Impact on development velocity
- Maintenance burden analysis
- Risk assessment
- Prioritization criteria
- Remediation options
- Resource requirements
- ROI calculation

Reference debt management from architectural decisions
```

## Usage Tips

1. **Provide specific context** about your current situation
2. **Include relevant metrics** or error messages when available
3. **Reference implementation guides** for detailed patterns
4. **Consider rollback plans** for significant changes
5. **Document decisions** made during troubleshooting

Remember: These templates help structure your requests, but always customize based on your specific needs and project context.
