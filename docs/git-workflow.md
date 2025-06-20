---
title: "Git Workflow"
version: "1.0.0"
lastUpdated: "2025-06-10"
description: "Outlines the branching strategy, commit conventions, and pull request process for this project."
---

# Git Workflow

This document outlines the branching strategy, commit conventions, and pull request process for this project.

## Branch Strategy

### Main Branches
- `main` - Production-ready code
- `develop` - Integration branch (Showcase only)

### Feature Branches
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Workflow
1. Create feature branch from main
2. Make changes with conventional commits
3. Open PR with description
4. Merge after review (Showcase) or self-merge (MVP)

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
- Open a PR from your feature branch to `main` (or `develop` for Showcase)
- Fill out the PR template with context and screenshots if relevant
- Assign reviewers for Showcase track
- Ensure all checks (CI, lint, tests) pass before merge

