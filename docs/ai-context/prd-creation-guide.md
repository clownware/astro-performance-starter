---
title: Creating a Website PRD
description: "Streamlined guide for creating Product Requirements Documents that supercharge AI-assisted development"
lastUpdated: true
tableOfContents: true
pagefind: true
---

# Creating a Website PRD for AI Context

> **Why PRDs Matter**: Transform vague project ideas into actionable development guidance for AI assistants

## What Makes a Great Website PRD

A great PRD serves three audiences:

1. **You** - Clarifies vision and requirements
2. **Your Team** - Aligns everyone on goals and scope  
3. **AI Assistants** - Provides context for intelligent recommendations

### Key Characteristics

- **Specific**: "Generate 50 qualified B2B leads monthly" vs "get more customers"
- **Outcome-Focused**: What success looks like, not just features to build
- **Constraint-Aware**: Budget, timeline, and technical limitations
- **Audience-Centered**: Based on real user needs, not assumptions

## 90-Minute PRD Creation Process

### Phase 1: Discovery (40 minutes)

#### Business Foundation (15 minutes)

- What is the single most important outcome this website must achieve?
- Who specifically are you trying to reach? (Be narrow, not broad)
- How will you measure success? (Specific numbers)

#### Competitive Context (10 minutes)

- What are 3 competitor websites you respect/fear?
- What do they do well that you want to match/beat?
- What gaps can you capitalize on?

#### Constraints & Resources (15 minutes)

- Realistic timeline and budget range
- Who provides content/assets?
- What existing materials do you have?

### Phase 2: Structure Planning (30 minutes)

#### Information Architecture (15 minutes)

- List must-have pages (usually 4-7 for most sites)
- Define primary call-to-action journey
- Map secondary actions users might take

#### Content Inventory (15 minutes)

- What content exists vs. needs creation?
- Who creates it and approval process?
- Content creation timeline

### Phase 3: Technical Requirements (20 minutes)

#### Functionality Needs (10 minutes)

- Forms and lead capture requirements
- Third-party integrations (CRM, email, analytics)
- Performance or security needs

#### Implementation Scope Selection (10 minutes)

Scope labels follow the progressive tier model in [ADR-033](/adr/033-track-consolidation/):

- **Essential scope**: Launch with core pages and functionality (2-3 weeks)
- **Recommended scope**: Add quality and polish for most projects (3-4 weeks)
- **Advanced scope**: Full design system, enterprise features, comprehensive content (4-6 weeks)

## Using the PRD Template

### Quick Start

1. **Download** the [Website PRD Template](/ai-context/website-prd-template/)
2. **Save As** `PRD-[project-name].md` in your project's `docs/` folder
3. **Block 90 minutes** for initial completion

### Section Priorities

- **Project Overview**: Vision statement guides everything else
- **Target Audience**: Be specific, base on research not assumptions
- **Site Architecture**: Limit core pages to essentials
- **Content Strategy**: Key messages should differentiate clearly
- **Technical Requirements**: Stick to starter defaults unless specific needs

## AI Assistant Integration

### Configuration Files

**For Claude Code and `AGENTS.md`-native tools (Cursor, Copilot, Codex CLI, …):**

No per-tool rules file to edit. Link the PRD from the [AI Context Index](/ai-context/) (`docs/ai-context/INDEX.md`, the AI context entry point) so every tool that follows the constitution's pointers finds it; for a session-scoped nudge, just reference the PRD path in the prompt.

**For VS Code + Copilot:**

```json
// .vscode/settings.json
{
  "github.copilot.advanced": {
    "contextFiles": ["docs/PRD-*.md"]
  }
}
```

### Effective AI Prompting

**Instead of**: "Create a homepage for my business"

**Try**: "Based on the PRD, create a homepage targeting [specific audience] with our primary value prop of [specific benefit]. Focus on [primary CTA] conversion."

## Common Mistakes to Avoid

### ❌ Vague Requirements

- "Increase engagement" → ✅ "Increase newsletter signups by 25%"
- "Modern design" → ✅ "Clean, minimal design like Stripe's homepage"
- "Better UX" → ✅ "Reduce form abandonment to under 15%"

### ❌ Feature-Focused

- "We need a blog" → ✅ "Establish thought leadership to increase leads"
- "Add testimonials" → ✅ "Convert visitors with credibility indicators"

### ❌ Assumption-Based

- "Users want detailed specs" → ✅ "Customer interviews show they need ROI calculators"
- "Everyone uses desktop" → ✅ "Analytics show 78% mobile traffic"

## PRD Maintenance

### Review Schedule

- **Weekly**: During active development
- **Monthly**: During maintenance phases
- **Quarterly**: Strategic reviews and updates

### What to Update

- Success metrics based on performance
- Content priorities from analytics
- Technical requirements as you scale
- Audience insights from feedback

### Version Control

- Keep PRD in version control with code
- Tag major revisions
- Link updates to feature releases

## Site Type Templates

### B2B SaaS Website

Focus: Trial conversion, enterprise trust signals, technical credibility

### Professional Services

Focus: Expertise demonstration, case studies, consultation booking

### E-commerce Store

Focus: Product discovery, conversion optimization, retention

### Portfolio/Agency Site

Focus: Work showcase, style demonstration, client acquisition

### Content/Media Site

Focus: Content engagement, subscriber growth, monetization

## Next Steps

1. **Create Your PRD**: Use template, spend 90 minutes on first draft
2. **Configure AI Context**: Set up IDE to reference PRD
3. **Test with AI**: Try development prompts referencing your PRD
4. **Iterate**: Refine based on results
5. **Share**: Get team feedback and alignment

**Remember**: Start with 80% complete and refine as you learn more about your users and market.

---

_See [AI Context Index](/ai-context/) and [Website PRD Template](/ai-context/website-prd-template/) for implementation guidance._
