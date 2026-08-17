---
title: Git Workflow
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Outlines the branching strategy, commit conventions, and pull request process
  for this project
tableOfContents: true
pagefind: true
---
This document outlines the branching strategy, commit conventions, and pull request process for this project.

## Branch Strategy

### Main Branch

- `master` - The single long-lived branch. Every change lands via a reviewed pull request; there is no `develop` integration branch.

### Feature Branches

- `feature/*` - New features and enhancements
- `fix/*` - Bug fixes and hotfixes
- `docs/*` - Documentation updates
- `chore/*` - Maintenance and tooling updates

### Workflow for Template Development

1. Create a feature branch from `master`
2. Make changes with conventional commits
3. Test locally with `pnpm dev` and run `pnpm quality:ci` before claiming done
4. Open a PR to `master` with a clear description
5. **Squash-merge** after review and CI checks pass — one conventional-commit subject per PR

### Workflow for Template Users

- Fork or use the template from `master` branch
- Adapt branching strategy to your project needs
- Consider simplified workflow: `master` + feature branches

## Commit Convention

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
- Consider automated deployment from master branch
- Use the included CI pipeline as a starting point
