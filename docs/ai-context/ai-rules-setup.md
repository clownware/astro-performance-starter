---
title: AI Rules Configuration
description: Set up AI assistant rules for consistent project guidance
lastUpdated: true
tableOfContents: true
pagefind: true
---

> 🤖 **Purpose**: Configure AI assistants with project-specific rules for consistent guidance

## Quick Setup

### 1. Copy Base Rules

The template includes a comprehensive AI rules file at the project root:

```bash
# Copy and rename for your AI tool
cp airules.example .windsurfrules    # For Windsurf
cp airules.example .cursorrules      # For Cursor
cp airules.example .clinerules       # For Cline
```

### 2. Customize Project Context

Edit your chosen rules file to match your specific project:

```markdown
# [Your Project Name]

Every time you choose to apply a rule(s), explicitly state the rule(s) in the output.

## Project Context
[Replace with your specific project description]
- Target audience: [your audience]
- Primary goals: [your goals]
- Key constraints: [your constraints]
```

### 3. Configure AI Tool

**For Windsurf:**

- Rules file: `.windsurfrules`
- Auto-detected at project root
- No additional configuration needed

**For Cursor:**

- Rules file: `.cursorrules`
- Auto-detected at project root
- Additional context in workspace settings

**For Cline:**

- Rules file: `.clinerules`
- May need manual configuration in extension settings

## Astro-Specific Rules Included

The template includes pre-configured rules for:

### Performance Standards

- Lighthouse 95+ targets
- JavaScript budget: <160KB
- CSS budget: <50KB
- Image optimization requirements

### Technical Patterns

- Astro 5.x best practices
- Islands architecture guidance
- TypeScript strict mode
- Component hierarchy (atomic design)

### Content Strategy

- Content Collections with Zod schemas
- MDX component patterns
- SEO optimization
- Accessibility (WCAG AA)

## Customization Examples

### B2B SaaS Website

```markdown
## Project Context
Lead generation website for enterprise SaaS product
- Target: VPs and Directors at 200+ person companies  
- Goal: 50 qualified leads per month
- Constraints: Must integrate with Salesforce CRM
```

### Portfolio/Agency Site

```markdown
## Project Context
Creative portfolio showcasing design work
- Target: Startup founders and marketing directors
- Goal: 5 premium project inquiries monthly
- Constraints: Heavy visual content, mobile-first
```

### E-commerce Store

```markdown
## Project Context
Performance-optimized e-commerce experience
- Target: Mobile-first shoppers, conversion focus
- Goal: <2s page load, >3% conversion rate
- Constraints: Large product catalog, international shipping
```

## Advanced Configuration

### IDE Integration

**VS Code with GitHub Copilot:**

```json
// .vscode/settings.json
{
  "github.copilot.advanced": {
    "contextFiles": [
      ".windsurfrules",
      "docs/ai-context/INDEX.md",
      "docs/PRD-*.md"
    ]
  }
}
```

**Continue.dev:**

```json
// .continue/config.json
{
  "contextProviders": [
    {
      "name": "docs",
      "params": {
        "folders": ["docs/ai-context/"]
      }
    }
  ]
}
```

### Multiple AI Tools

If using multiple AI assistants, maintain consistency:

```bash
# Keep rules synchronized
cp .windsurfrules .cursorrules
cp .windsurfrules .clinerules

# Or use symbolic links (Unix/Mac)
ln -s .windsurfrules .cursorrules
ln -s .windsurfrules .clinerules
```

## Testing Your Configuration

### Validation Prompts

Test your rules with these prompts:

```text
"Based on our project rules, create a new component called ProductCard"
```

Should reference:

- Design tokens usage
- TypeScript interfaces
- Accessibility requirements
- Performance considerations

```text
"Optimize the homepage for our target audience"
```

Should reference:

- Project-specific audience
- Conversion goals
- Performance budgets
- Brand guidelines

### Rule Enforcement Check

Look for these patterns in AI responses:

- **Rule References**: "Following the [rule name] pattern..."
- **Project Context**: Mentions your specific audience/goals
- **Constraint Awareness**: Respects budgets and limitations
- **Pattern Consistency**: Uses established conventions

## Maintenance

### When to Update Rules

1. **Project Evolution**: Goals or audience change
2. **New Patterns**: Discovered better approaches
3. **Tool Updates**: AI assistant capabilities change
4. **Team Feedback**: Rules aren't working effectively

### Update Process

```bash
# 1. Test changes in separate file first
cp .windsurfrules test-rules.txt

# 2. Make incremental changes
# Edit test-rules.txt

# 3. Validate with AI assistant
# Test key prompts

# 4. Deploy if successful  
cp test-rules.txt .windsurfrules
```

### Version Control

```bash
# Add rules to git (recommended)
git add .windsurfrules .cursorrules .clinerules

# Or keep private (add to .gitignore)
echo ".windsurfrules" >> .gitignore
echo ".cursorrules" >> .gitignore
echo ".clinerules" >> .gitignore
```

## Troubleshooting

### Rules Not Applied

1. **Check File Location**: Must be at project root
2. **Verify File Name**: Exact spelling required
3. **Restart AI Tool**: May need to reload workspace
4. **Test with Explicit Reference**: "Following our project rules..."

### Inconsistent Responses

1. **Review Rule Clarity**: Avoid ambiguous language
2. **Add Specific Examples**: Show desired patterns
3. **Remove Contradictions**: Ensure rules don't conflict
4. **Prioritize Rules**: Most important rules first

### Performance Issues

1. **Rule File Size**: Keep under 2000 lines
2. **Complex Logic**: Simplify decision trees
3. **Context Overload**: Focus on essential guidance only

Remember: AI rules are most effective when they're specific, actionable, and aligned with your actual development workflow.
