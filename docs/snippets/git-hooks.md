---
title: git hooks
description: >-
  Husky install steps and the template's three hook files (pre-commit,
  commit-msg, pre-push)
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
pnpm exec lint-staged
```

**`.husky/commit-msg`:**

```bash
pnpm exec commitlint --edit "$1"
```

**`.husky/pre-push`:**

```bash
#!/usr/bin/env sh
# Run the unit test suite before pushing so failures surface locally
# instead of in CI. Skip with --no-verify if you have a deliberate reason
# (e.g. pushing WIP for backup).
pnpm run test:unit
```

> Current Husky hook files are plain shell commands — the `husky.sh` sourcing
> boilerplate from older Husky releases is gone.
