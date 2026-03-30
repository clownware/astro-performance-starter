---
name: pr-description
description: "Writes pull request descriptions following the project's PR template. Use when creating a PR, writing a PR, or summarizing changes for a pull request."
allowed-tools: Bash, Read, Grep, Glob
license: MIT
---

Write a pull request description for the current branch.

## Branch context (pre-fetched)

**Base branch:** !`git rev-parse --verify develop 2>/dev/null && echo "develop" || git rev-parse --verify main 2>/dev/null && echo "main" || echo "master"`

**Commits on this branch:**
!`BASE=$(git rev-parse --verify develop 2>/dev/null && echo develop || git rev-parse --verify main 2>/dev/null && echo main || echo master); git log "$BASE"...HEAD --oneline 2>/dev/null || echo "(no commits diverged from $BASE)"`

**Changed files:**
!`BASE=$(git rev-parse --verify develop 2>/dev/null && echo develop || git rev-parse --verify main 2>/dev/null && echo main || echo master); git diff "$BASE"...HEAD --stat 2>/dev/null || echo "(no diff found)"`

**Full diff:**
!`BASE=$(git rev-parse --verify develop 2>/dev/null && echo develop || git rev-parse --verify main 2>/dev/null && echo main || echo master); git diff "$BASE"...HEAD 2>/dev/null || echo "(no diff found)"`

## Steps

### 1. Read the PR template

Read `.github/PULL_REQUEST_TEMPLATE.md` and follow its structure exactly. The template has these sections:

- **What** — brief description, link to issue
- **Why** — motivation, problem solved
- **How** — implementation approach, non-obvious design decisions
- **Testing** — checkboxes for `pnpm run check`, `pnpm run lint`, manual testing
- **Checklist** — ADR-035 scope, performance budgets, no `client:load` without ADR, design tokens, TypeScript strict, accessibility
- **Screenshots** — before/after for UI changes

### 2. Write the description

Read through ALL commits above, not just the latest. The PR description must cover the entire branch.

Fill out every section of the template. For the checklist, check each box that applies based on the actual changes.

Call out non-obvious design decisions in the **How** section. If there were alternatives you considered, mention why this approach was chosen.

### 3. ADR check

Check whether changes touch areas covered by existing ADRs in `docs/adr/`. If changes introduce a new architectural decision not covered by an existing ADR, add a note:

> **Note:** This PR introduces [decision]. Consider documenting this in a new ADR.

### 4. Output

Print the complete PR description in markdown, ready to paste into GitHub. Do not wrap it in a code fence — output raw markdown.
