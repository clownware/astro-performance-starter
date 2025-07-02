---
title: Creating a Website PRD
description: "Guide for creating Product Requirements Documents that supercharge AI-assisted development"
lastUpdated: true
tableOfContents: true
pagefind: true
---

# Creating a Website PRD for AI Context

> **Why PRDs Matter**: A well-crafted PRD transforms vague project ideas into actionable development guidance. For AI-assisted development, it's the difference between generic suggestions and context-aware recommendations that actually fit your project.

## What Makes a Great Website PRD

A great PRD serves three audiences:

1. **You** - Clarifies your vision and requirements
2. **Your Team** - Aligns everyone on goals and scope  
3. **AI Assistants** - Provides context for intelligent recommendations

### Key Characteristics

- **Specific over Generic**: "Generate 50 qualified B2B leads monthly" vs "get more customers"
- **Outcome-Focused**: What success looks like, not just what you want to build
- **Constraint-Aware**: Budget, timeline, and technical limitations
- **Audience-Centered**: Based on real user needs, not assumptions

## Step-by-Step PRD Creation

### Phase 1: Discovery (30-60 minutes)

Start with these fundamental questions:

#### Business Foundation

- What is the single most important outcome this website must achieve?
- Who specifically are you trying to reach? (Be narrow, not broad)
- What do they need to believe/feel/do after visiting your site?
- How will you measure success? (Specific numbers, not "more traffic")

#### Competitive Context

- What are 3 competitor websites you respect/fear?
- What do they do well that you want to match/beat?
- What do they miss that you can capitalize on?

#### Constraints & Resources

- What's your realistic timeline?
- What's your budget range?
- Who will provide content/assets?
- What existing materials do you have?

### Phase 2: Structure Planning (20-30 minutes)

#### Information Architecture

- List your must-have pages (usually 4-7 for most sites)
- Define the primary call-to-action journey
- Map secondary actions users might take
- Consider what happens after conversion

#### Content Inventory

- What content do you have?
- What needs to be created?
- Who will create it?
- What's the approval process?

### Phase 3: Technical Requirements (15-20 minutes)

#### Functionality Needs

- Forms and lead capture
- Third-party integrations (CRM, email, analytics)
- Content management requirements
- Performance or security needs

#### Implementation Track Selection

- **MVP Track**: Choose if you need to launch quickly with basics
- **Showcase Track**: Choose if you want full features and polish

## Using the PRD Template

### Before You Start

1. **Download** the [Website PRD Template](./website-prd-template.md)
2. **Save As** `PRD-[project-name].md` in your project's `docs/` folder
3. **Block 90 minutes** for initial completion (you can refine later)

### Filling Out Each Section

**Project Overview** ⏱️ 15 minutes

- Start with Vision Statement - this guides everything else
- Make Primary Objective measurable and specific
- Success Metrics should be trackable from day one

**Target Audience** ⏱️ 20 minutes

- Be specific about who you're targeting
- Base on real research/conversations, not assumptions
- Include what motivates them and what holds them back

**Site Architecture** ⏱️ 15 minutes

- Limit Core Pages to essentials (less is more)
- Each CTA should have a clear purpose
- Think mobile-first for navigation

**Content Strategy** ⏱️ 20 minutes

- Key Messages should differentiate you clearly
- Brand Voice examples help AI assistants match your style
- Be realistic about content creation timeline

**Design Requirements** ⏱️ 10 minutes

- Include links to inspiration sites
- Specify what to avoid (as important as what to include)
- Accessibility needs beyond the defaults

**Technical Requirements** ⏱️ 10 minutes

- Stick to starter defaults unless you have specific needs
- List integrations you actually need (not "nice to haves")
- Consider ongoing maintenance requirements

## Integrating PRDs with AI Development

### Setting Up AI Context

1. **File Location**: Place your PRD in `docs/PRD-[project-name].md`
2. **IDE Integration**: Configure your AI assistant to reference this file
3. **Update Regularly**: Keep the PRD current as requirements evolve

### AI Assistant Configuration

#### For VS Code + Copilot/Codeium

```json
// .vscode/settings.json
{
  "github.copilot.advanced": {
    "contextFiles": [
      "docs/PRD-*.md",
      "docs/implementation-guides/ai-context/INDEX.md"
    ]
  }
}
```

#### For Cursor AI

```json
// .cursorrules
{
  "contextFiles": [
    "docs/PRD-*.md",
    "ONBOARDING.md",
    "docs/implementation-guides/ai-context/"
  ]
}
```

#### For Continue.dev

```json
// .continue/config.json
{
  "contextProviders": [
    {
      "name": "docs",
      "params": {
        "folders": ["docs/"]
      }
    }
  ]
}
```

### Effective AI Prompting with PRDs

**Instead of**: "Create a homepage for my business"

**Try**: "Based on the PRD, create a homepage that targets [specific audience] with our primary value prop of [specific benefit]. Focus on the [primary CTA] conversion goal."

**Instead of**: "Make this look better"

**Try**: "Improve this component to better match our brand voice from the PRD - it should feel [specific tone] and guide users toward [specific action]."

## PRD Maintenance & Evolution

### Regular Review Schedule

- **Weekly**: During active development
- **Monthly**: During maintenance phases
- **Quarterly**: Strategic reviews and updates

### What to Update

- Success metrics and targets
- Content priorities based on performance
- Technical requirements as you scale
- Audience insights from analytics/feedback

### Version Control

- Keep PRD in version control with your code
- Tag major revisions
- Link PRD updates to feature releases

## Common PRD Mistakes

### ❌ Too Vague

- "Increase engagement"
- "Modern design"
- "Better user experience"

### ✅ Specific & Measurable  

- "Increase newsletter signups by 25%"
- "Clean, minimal design like Stripe's homepage"
- "Reduce contact form abandonment to under 15%"

### ❌ Feature-Focused

- "We need a blog"
- "Add social media integration"
- "Include testimonials"

### ✅ Outcome-Focused

- "Establish thought leadership to increase inbound leads"
- "Build community trust through social proof"
- "Convert visitors with credibility indicators"

### ❌ Assumption-Based

- "Users want detailed technical specs"
- "People read long-form content"
- "Everyone uses desktop"

### ✅ Research-Based

- "Customer interviews show they need ROI calculators"
- "Analytics show 78% mobile traffic"
- "Support tickets indicate FAQ needs"

## Advanced PRD Techniques

### Persona-Driven Requirements

Instead of generic user stories, create specific scenarios:

- "Sarah, VP Marketing at 200-person SaaS company, visits on mobile during commute, needs to quickly assess if we're enterprise-ready"

### Competitive Differentiation Matrix

Create a table comparing you vs competitors on key factors your audience cares about.

### Content-Market Fit Planning

Map content types to funnel stages and audience segments.

### Technical Debt Considerations

Document what you're intentionally leaving out now and why.

## PRD Templates for Common Site Types

### B2B SaaS Website

Focus on: Trial conversion, enterprise trust signals, technical credibility

### Professional Services

Focus on: Expertise demonstration, case studies, consultation booking

### E-commerce Store

Focus on: Product discovery, conversion optimization, customer retention

### Portfolio/Agency Site

Focus on: Work showcase, style demonstration, client acquisition

### Content/Media Site

Focus on: Content engagement, subscriber growth, monetization

---

## Next Steps

1. **Create Your PRD**: Use the template and spend 90 minutes on your first draft
2. **Configure AI Context**: Set up your IDE to reference the PRD
3. **Test with AI**: Try a few development prompts referencing your PRD
4. **Iterate**: Refine based on what works and what doesn't
5. **Share**: Get team feedback and alignment

Remember: A PRD is a living document. Start with 80% complete and refine as you learn more about your users and market.

---

*For more implementation guidance, see the [AI Context Index](../ai-context/INDEX.md) and [Implementation Overview](../implementation-guides/00-overview/README.md).*
