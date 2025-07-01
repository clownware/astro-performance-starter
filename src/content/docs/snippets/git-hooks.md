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

**`.husky/pre-commit`:**

```bash
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

pnpm exec lint-staged
```

**`.husky/commit-msg`:**

```bash
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

pnpm exec commitlint --edit $1
```
