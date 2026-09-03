---
title: commitlint config
description: Conventional-commits commitlint configuration (.commitlintrc.cjs)
lastUpdated: true
tableOfContents: true
pagefind: true
---
```js
// .commitlintrc.cjs
module.exports = {
  extends: ["@commitlint/config-conventional"],
};
```

The project relies on the conventional preset's defaults — no custom `rules`
block is needed. The preset enforces:

- **Type**: one of `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`,
  `refactor`, `revert`, `style`, `test`, written in lower-case.
- **Subject**: required, no trailing full stop, and never in sentence-case,
  start-case, pascal-case, or upper-case (a subject in lower-case or kebab-case
  passes; `fix(tokens): Correct contrast` does not).
- **Header**: at most 100 characters, with leading and trailing whitespace
  trimmed.

Husky's `commit-msg` hook runs `pnpm exec commitlint --edit "$1"` on every
commit (see [git hooks](/snippets/git-hooks/)).

**Installation:**

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```
