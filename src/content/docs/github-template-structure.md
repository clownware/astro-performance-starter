---
title: GitHub Template Structure
description: >-
  An overview of the Astro Performance Starter template's recommended repository
  structure for a minimal setup
lastUpdated: true
tableOfContents: true
pagefind: true
---
# Astro Performance Template - Repository Structure

## Recommended GitHub Repository Structure

```bash
astro-performance-starter/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                    # Working CI pipeline
│   ├── FUNDING.yml                   # Optional sponsorship
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── phase_completion.md
│
├── docs/
│   ├── README.md                     # Docs overview & navigation
│   ├── ROADMAP.md                    # Phase-by-phase guide
│   ├── implementation-guides/        # All the guides
│   │   ├── 00-overview/
│   │   ├── 01-foundation/
│   │   ├── 02-structure/
│   │   ├── 03-content/
│   │   ├── 04-quality/
│   │   ├── 05-deployment/
│   │   ├── ai-context/
│   │   ├── patterns/
│   │   └── tracks/
│   └── adr/
│       ├── template.md
│       └── 001-starter-decisions.md
│
├── src/                              # Minimal implementation
│   ├── components/
│   │   ├── atoms/
│   │   │   └── Button.astro         # One example component
│   │   ├── structural/
│   │   │   ├── Container.astro
│   │   │   └── Section.astro
│   │   └── README.md                # Component guidelines
│   ├── content/
│   │   ├── config.ts                # Full schema setup
│   │   └── blog/
│   │       └── example-post.mdx     # One example
│   ├── layouts/
│   │   ├── BaseLayout.astro         # Complete base layout
│   │   └── partials/
│   │       ├── Header.astro
│   │       └── Footer.astro
│   ├── pages/
│   │   ├── index.astro              # Minimal homepage
│   │   └── 404.astro
│   ├── styles/
│   │   └── global.css               # With token integration
│   └── utils/
│       └── url-utils.ts             # Example utility
│
├── public/
│   ├── _headers                     # Security headers
│   ├── favicon.svg
│   └── robots.txt
│
├── scripts/
│   ├── build-tokens.ts              # Working token builder
│   └── validate-contrast.ts         # Working validator
│
├── tokens/
│   ├── base.json                    # Complete token set
│   ├── semantic.json
│   └── dist/                        # Git-ignored
│
├── .vscode/
│   ├── extensions.json              # Recommended extensions
│   └── settings.json                # Project settings
│
├── .husky/
│   └── pre-commit                   # Working git hooks
│
├── .env.example                     # Environment template
├── .gitignore                       # Comprehensive ignore
├── .nvmrc                           # Node version
├── ONBOARDING.md                    # Quick start guide
├── README.md                        # Project overview
├── LICENSE                          # MIT recommended
├── astro.config.mjs                 # Minimal config
├── biome.json                       # Complete config
├── budget-overrides.json            # Example overrides
├── package.json                     # All deps, no fluff
├── tailwind.config.ts               # Token integration
└── tsconfig.json                    # Strict mode
```

## What to Include vs Exclude

### INCLUDE (Minimal but Working)

1. **Complete Configuration Files**
   * All config files with sensible defaults
   * Working CI pipeline
   * Git hooks setup
   * VS Code settings

2. **Token System**
   * Full token files
   * Build script
   * Integration with Tailwind
   * Validation scripts

3. **Core Components**
   * BaseLayout (complete)
   * 2-3 example components showing patterns
   * One of each content type

4. **Documentation**
   * All implementation guides
   * Working examples in code
   * Clear README with "Use this template" instructions

### EXCLUDE (Let Users Build)

1. **Full Component Library**
   * Just show the pattern with Button
   * Let them build the rest

2. **Complete Pages**
   * Only index and 404
   * Let them create their content

3. **Business Logic**
   * No complex features
   * No API integrations

4. **Deployment Configs**
   * Document but don't include
   * Too platform-specific

## Repository Setup

### 1. Create as Template Repository

In GitHub settings, check "Template repository" to enable the "Use this template" button.

### 2. README.md Structure

````markdown
# Astro Performance Starter

> Production-ready Astro starter with Performance ≥ 95, Accessibility 100, Best-Practices 100, SEO 100, comprehensive tooling, and AI-assisted development guides.

**Lighthouse Target Benchmarks:** Performance ≥ 95, Accessibility 100, Best-Practices 100, SEO 100

<small>Scores may vary ±3 pts depending on device and network. Our CI guards ensure Performance never ships below 95.</small>
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- **Astro {{versions.astro}}** with zero JavaScript by default
- **Tailwind CSS {{versions.tailwindcss}}** with design tokens
- **Biome** for 20x faster linting/formatting
- **Islands Architecture** patterns and guides
- **Mobile-first** responsive design
- **Dark mode** with system preference detection
- **WCAG AA** accessibility compliance
- **AI-ready** documentation structure
- **Performance budgets** with CI enforcement
- **Testing strategies** for both MVP and Showcase tracks

## Quick Start

Use this template to create your own repository:

1. Click the "Use this template" button above
2. Clone your new repository
3. Follow the [Onboarding Guide](ONBOARDING.md)

```bash
# After cloning
cd your-project
pnpm install
pnpm run build:tokens
pnpm run dev
````

## Documentation

This starter includes comprehensive phase-by-phase implementation guides:

* **[Implementation Roadmap](/docs/ROADMAP/)** - Start here!
* **[Track Comparison](/docs/implementation-guides/tracks/track-comparison/)** - MVP vs Showcase
* **[AI Context Guide](/docs/implementation-guides/ai-context/INDEX/)** - For AI assistants

## Choose Your Track

### MVP Track (2-3 weeks)

Perfect for portfolios, blogs, and content sites. Zero JavaScript, maximum performance.

### Showcase Track (4-6 weeks)

Ideal for demonstrating technical skills with selective interactivity and comprehensive testing.

## Project Structure

```bash
src/
├── components/      # Atomic design components
├── content/         # Type-safe content collections
├── layouts/         # Page layouts
├── pages/           # File-based routing
└── styles/          # Global styles with tokens
```

## Built With

* [Astro](https://astro.build) - Static site generator
* [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
* [Biome](https://biomejs.dev) - Fast formatter & linter
* [TypeScript](https://www.typescriptlang.org) - Type safety
* Design tokens for consistent theming

## Learning Resources

* [Why These Technology Choices?](/docs/implementation-guides/00-overview-tech-stack/)
* [Performance Budget Philosophy](/docs/implementation-guides/00-overview-budgets-guardrails/)
* [Islands Architecture Guide](/docs/implementation-guides/patterns/islands-architecture/)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](/CONTRIBUTING/) first.

## License

MIT \[Your Name]

***

Built with for the web performance community

### 3. Add GitHub-Specific Files

#### .github/FUNDING.yml

```yaml
github: [yourusername]
custom: ["https://www.buymeacoffee.com/yourusername"]
```

#### .github/ISSUE\_TEMPLATE/phase\_completion.md

```markdown


***


name: Phase Completion Checklist
about: Track completion of implementation phases
title: 'Phase [X] Complete: [Phase Name]'
labels: phase-completion


***



## Phase Details
- **Phase Number**: 
- **Phase Name**: 
- **Track**: [ ] MVP / [ ] Showcase
- **Duration**: Actual vs Estimated

## Exit Criteria Checklist
<!-- Copy from phase document -->
- [ ] Criterion 1
- [ ] Criterion 2

## Lessons Learned
<!-- What would you do differently? -->

## Updates Needed
- [ ] Update AI Context Index
- [ ] Create/update ADRs
- [ ] Update performance baselines
```

## Starter Content

### Include Working Examples

#### src/pages/index.astro

```astro


***


import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/structural/Container.astro';
import Section from '@/components/structural/Section.astro';
import Button from '@/components/atoms/Button.astro';


***



<BaseLayout 
  title="Astro Performance Starter"
  description="Lightning-fast starter template with Lighthouse target benchmarks (Performance ≥ 95, Accessibility 100, Best-Practices 100, SEO 100)"
>
  <Section size="lg">
    <Container>
      <h1 class="text-4xl font-bold mb-4">
        Welcome to Your New Site
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
        This starter is pre-configured for maximum performance and developer experience.
      </p>
      <div class="flex gap-4">
        <Button href="./docs/ROADMAP">
          Read the Docs
        </Button>
        <Button href="https://github.com/yourusername/astro-performance-starter" variant="secondary" external>
          View on GitHub
        </Button>
      </div>
    </Container>
  </Section>

  <Section size="md" background="subtle">
    <Container>
      <h2 class="text-2xl font-semibold mb-4">Quick Stats</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold text-primary-600">100</div>
          <div class="text-sm text-gray-600">Lighthouse Score</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-primary-600">0KB</div>
          <div class="text-sm text-gray-600">JavaScript</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-primary-600">&lt;1s</div>
          <div class="text-sm text-gray-600">Load Time</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-primary-600">A+</div>
          <div class="text-sm text-gray-600">Accessibility</div>
        </div>
      </div>
    </Container>
  </Section>
</BaseLayout>
```

## Why Include Working Code?

1. **Immediate Value**: Developers can run the project and see it working
2. **Pattern Examples**: Shows best practices in action
3. **Config Verification**: All configs are tested and working
4. **Learning Tool**: Code examples reinforce the documentation
5. **Fork-and-Go**: Ready to customize immediately

## Publishing Checklist

* \[ ] Test fresh install: `pnpm create astro@latest -- --template github:yourusername/astro-performance-starter`
* \[ ] Run through ONBOARDING.md steps
* \[ ] Verify CI passes on master branch
* \[ ] Check all documentation links work
* \[ ] Test both MVP and Showcase track instructions
* \[ ] Add topics to GitHub: `astro`, `tailwindcss`, `performance`, `template`, `starter`
* \[ ] Create initial release with changelog
* \[ ] Consider submitting to [Astro Themes](https://astro.build/themes/)

This approach gives developers both the comprehensive guides AND a working starting point, making it much more likely they'll successfully use the framework.
