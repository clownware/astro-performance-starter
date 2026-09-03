---
title: Git Workflow
lastUpdated: true
description: >-
  Outlines the branching strategy, commit conventions, and pull request process
  for this project
tableOfContents: true
pagefind: true
---
This document outlines the branching strategy, commit conventions, and pull request process for this project.

## Branch Strategy

### Main Branches

- `master` - The single long-lived branch: stable, production-ready code; releases are tagged from it

### Feature Branches

- `feat/*` - New features and enhancements
- `fix/*` - Bug fixes and hotfixes
- `docs/*` - Documentation updates
- `chore/*` - Maintenance and tooling updates

### Workflow for Template Development

1. Create feature branch from `master` (pattern: `type/description`, e.g. `feat/new-component-pattern`)
2. Make changes with conventional commits
3. Test locally with `pnpm dev`, then run `pnpm run quality` and `pnpm run build` before opening the PR
4. Open PR to `master` with clear description
5. Merge after review and CI checks pass
6. Releases are tagged from `master`

### Workflow for Template Users

- Fork or use the template from `master` branch
- Adapt branching strategy to your project needs
- Consider simplified workflow: `main` + feature branches

## Commit Convention

Commit messages are linted by commitlint (see [commitlint config](/snippets/commitlint-config/)). Types:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `perf:` - Performance improvement
- `test:` - Testing
- `chore:` - Maintenance

## Pull Request Process

### For Template Development

- Open PR from feature branch to `master`
- Fill out PR template with context and screenshots if relevant
- Assign reviewers and wait for approval
- Ensure all checks (CI, lint, build) pass before merge

### For Template Users

- Adapt this process to your team's needs
- Consider automated deployment from main branch
- Use the included CI pipeline as a starting point
