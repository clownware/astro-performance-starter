---
title: "Contributing to Astro Performance Starter"
version: "1.0.0"
lastUpdated: "2025-06-10"
description: "Guidelines and standards for contributing to the Astro Performance Starter project."
---

# Contributing to Astro Performance Starter

Thank you for your interest in contributing! This project follows a structured approach to ensure quality and consistency.

## 📋 Prerequisites

- Node.js 22.x or later
- pnpm 9.x or later
- Familiarity with our [Implementation Guides](docs/implementation-guides/00-overview/README.md)

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

- Component changes: See [Phase 5](docs/implementation-guides/02-structure/phase-5-components.md)
- Performance changes: See [Phase 9](docs/implementation-guides/04-quality/phase-9-performance.md)
- Documentation: Match existing style and formatting

### 4. Validate Your Changes

```bash
# Run quality checks
pnpm run quality

# Test the build
pnpm run build

# Check performance impact
pnpm run lighthouse
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

### Version Management (Template-Specific)

This project uses a **centralized version injection system** to keep all documentation DRY:

- **Single Source**: All versions managed in `docs/meta/versions.yml`
- **Placeholders**: Use `{{versions.astro}}`, `{{versions.tailwindcss}}`, etc. instead of hardcoded versions
- **Auto-Update**: Run `pnpm tsx scripts/update-versions.ts` after dependency updates
- **Never Hardcode**: Always use placeholders for version references in documentation

**Common Placeholders:**

| Tool/Dependency   | Placeholder                |
|-------------------|----------------------------|
| Astro             | `{{versions.astro}}`       |
| Tailwind CSS      | `{{versions.tailwindcss}}` |
| Node.js           | `{{versions.node}}`        |
| TypeScript        | `{{versions.typescript}}`  |
| Biome             | `{{versions.biome}}`       |

**Adding New Versions:**

1. Add to `docs/meta/versions.yml`
2. Use placeholder in docs: `{{versions.newtool}}`
3. Run update script to sync versions

## 🧪 Testing Requirements

### Testing Philosophy

We follow a **progressive testing approach**:

- **During Development**: Write tests alongside features (TDD encouraged)
- **Component Changes**: Add unit tests for new components
- **Page Changes**: Add E2E tests for new pages or critical paths
- **Before PR**: Run full test suite to catch regressions
- **Pre-Launch**: Comprehensive testing per track (MVP vs Showcase)

See [Testing Strategy Guide](docs/implementation-guides/guides/testing-strategy-guide.md) for details.

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

- **Questions**: Open a [Discussion](https://github.com/yourusername/astro-performance-starter/discussions)
- **Bugs**: Open an [Issue](https://github.com/yourusername/astro-performance-starter/issues)
- **Ideas**: Share in Discussions first
- **Chat**: Join us in the Astro Discord

## 🙏 Recognition

Contributors will be:

- Added to the README contributors section
- Mentioned in release notes
- Given credit in relevant documentation

Thank you for helping make this starter better for everyone! 🚀
