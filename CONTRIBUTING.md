---
title: "Contributing to Astro Performance Starter"
version: "1.0.0"
lastUpdated: "2026-03-29"
description: "Guidelines and standards for contributing to the Astro Performance Starter project."
---

# Contributing to Astro Performance Starter

Thank you for your interest in contributing! This project follows a structured approach to ensure quality and consistency.

## 📋 Prerequisites

- Node.js 24.x or later
- pnpm 10.x or later
- Familiarity with our [Implementation Guides](docs/implementation-guides/README.md)

## AI-Assisted Development

This project ships with pre-configured AI assistant context for multiple tools, using the [AGENTS.md](https://agents.md) cross-tool pattern:

- **Cross-tool spine:** `AGENTS.md` at the repo root — read natively by Cursor, Codex CLI, Copilot, Windsurf, Aider, Devin, Zed, Continue, Amp, and Amazon Q. Generated from the layered constitution; do not edit directly.
- **Claude Code:** `CLAUDE.md` + the layered `.claude/{engineering,workflow,stack}.md` files + the `.claude/` directory (skills, agents, settings, roles) — auto-detected on session start
- **Windsurf:** `.windsurfrules` is a thin Cascade-specific overlay; full context comes from `AGENTS.md`
- **Adding a new tool:** if it reads `AGENTS.md` natively, no setup is needed. If not, add a thin overlay following the `.windsurfrules` template.

Claude Code includes project-specific skills (`/pr-description`, `/component-scaffold`) and a `code-reviewer` subagent that checks changes against the project's ADRs, performance budgets, and component patterns. To update shared rules, edit the source layer in `.claude/` (or `CLAUDE.md`) and run `pnpm agents:build` — CI fails on drift. See `docs/ai-context/ai-rules-setup.md` for full setup details and ADR-045 for the cross-tool architecture.

## 🎯 Ways to Contribute

### 1. Documentation Improvements

- Fix typos or clarify instructions
- Add examples or use cases
- Translate guides to other languages
- Improve AI context documents

### 2. Code Enhancements

- Fix bugs in the starter template
- Improve performance optimizations
- Add new design tokens
- Enhance accessibility features

### 3. Pattern Contributions

- Document new patterns you've discovered
- Share performance optimization techniques
- Add new component examples (following our patterns)

### 4. Testing and Feedback

- Report issues with clear reproduction steps
- Test on different devices and browsers
- Provide feedback on the implementation guides

## 🔄 Development Workflow

### 1. Fork and Clone

```bash
# Fork on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/astro-performance-starter.git
cd astro-performance-starter
pnpm install
```

### 2. Create a Branch

```bash
# Pattern: type/description
git checkout -b docs/improve-phase-5-examples
git checkout -b fix/contrast-validation-script
git checkout -b feat/new-component-pattern
```

### 3. Make Your Changes

Follow the appropriate phase guide:

- Component changes: See [Phase 5](docs/implementation-guides/active-phases/phase-5-components.md)
- Performance changes: See [Phase 9](docs/implementation-guides/active-phases/phase-9-performance.md)
- Documentation: Match existing style and formatting

### 4. Validate Your Changes

```bash
# Run quality checks
pnpm run quality

# Test the build
pnpm run build

# Check performance impact
pnpm run perf:lighthouse
```

### 5. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: type(scope): description

git commit -m "docs(phase-5): add accessible modal example"
git commit -m "fix(tokens): correct dark mode contrast ratios"
git commit -m "feat(components): add skeleton loading pattern"
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding missing tests
- `chore`: Changes to build process or auxiliary tools

### 6. Submit Pull Request

1. Push your branch: `git push origin your-branch-name`
2. Open a Pull Request on GitHub
3. Fill out the PR template completely
4. Link any related issues

## 📏 Code Standards

### TypeScript

- Strict mode is required
- All exports must be typed
- Use interfaces over types when possible

### Components

- Must be accessible (WCAG AA minimum)
- Include TypeScript props interface
- Follow Atomic Design principles
- Zero JavaScript by default

### Styling

- Use design tokens, never hardcode values
- Follow mobile-first approach
- Support dark mode
- Maintain CSS budget limits

### Documentation

- Every pattern needs an example
- Include "why" not just "how"
- Reference phase guides when relevant
- Update AI context if adding new patterns
- **Use Standard Front-Matter**: All documentation files should include YAML front-matter with `title`, `version`, `lastUpdated` (YYYY-MM-DD), and a brief `description`.

### Version Management

Version references in documentation use hardcoded values from `package.json`. When updating dependencies:

1. Update the dependency in `package.json`
2. Search docs for the old version number and update references
3. Key files that contain version references:
   - `docs/implementation-guides/completed/phase-0-foundation.md`
   - `docs/implementation-guides/guides/testing-strategy-guide.md`
   - `docs/patterns/component-patterns.md`

## 🧪 Testing Requirements

### Testing Philosophy

We follow a **progressive testing approach**:

- **During Development**: Write tests alongside features (TDD encouraged)
- **Component Changes**: Add unit tests for new components
- **Page Changes**: Add E2E tests for new pages or critical paths
- **Before PR**: Run full test suite to catch regressions
- **Pre-Launch**: Comprehensive testing per implementation tier

See [Testing Strategy Guide](docs/implementation-guides/guides/testing-strategy-guide.md) for the strategic overview, and [Testing Conventions](docs/development/testing-conventions.md) for the practical "how to write a good test in this repo" reference (AAA, single-assertion, the conditional-assertion anti-pattern, mock-or-not decisions). The five testing-discipline rules live in [`.claude/engineering.md`](.claude/engineering.md), per [ADR-037](docs/adr/037-testing-philosophy.md).

### For Code Changes

- [ ] Passes all quality checks (`pnpm run quality`)
- [ ] Unit tests added/updated (`pnpm run test:unit`)
- [ ] E2E tests added for new pages/features (`pnpm run test:e2e`)
- [ ] Lighthouse scores remain 95+ for performance
- [ ] No accessibility regressions (`pnpm run test:a11y`)
- [ ] Bundle size within budgets
- [ ] Works without JavaScript enabled

### For Documentation

- [ ] Links are not broken
- [ ] Code examples are tested
- [ ] Formatting is consistent
- [ ] AI context updated if needed

## 🚀 Pull Request Guidelines

### PR Title Format

Follow conventional commits format:

```text
docs(phase-5): improve component examples
fix(ci): correct bundle size calculation
feat(tokens): add motion timing tokens
```

### PR Description Template

```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested locally
- [ ] Lighthouse scores verified
- [ ] Accessibility checked
- [ ] Bundle size checked

## Related Issues
Closes #123
```

### Review Process

1. Automated checks must pass
2. At least one maintainer review for code changes
3. Documentation changes can be self-merged after 24 hours

## 🤝 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Unacceptable Behavior

- Harassment or discriminatory language
- Personal attacks or trolling
- Public or private harassment
- Publishing others' private information

## 💡 Getting Help

- **Questions**: Open a Discussion on GitHub
- **Bugs**: Open an Issue on GitHub
- **Ideas**: Share in Discussions first
- **Chat**: Join us in the Astro Discord

## 🙏 Recognition

Contributors will be:

- Added to the README contributors section
- Mentioned in release notes
- Given credit in relevant documentation

Thank you for helping make this starter better for everyone! 🚀
