---
title: Install Husky
description: '```bash'
lastUpdated: true
tableOfContents: true
pagefind: true
---
```bash
# Install Husky
pnpm add -D husky lint-staged
pnpm exec husky init

# Create pre-commit hook
echo 'pnpm exec lint-staged' > .husky/pre-commit
```

Husky v9 hooks are plain one-line scripts — no shebang or `husky.sh` sourcing:

**`.husky/pre-commit`:**

```bash
pnpm exec lint-staged
```

**`.husky/commit-msg`:**

```bash
pnpm exec commitlint --edit "$1"
```
