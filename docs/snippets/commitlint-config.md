---
title: commitlint config
description: "```js\r // .commitlintrc.cjs\r module.exports = {\r   extends: [\"@commitlint/config-conventional\"],\r };"
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

The project relies on the conventional preset's defaults — it already enforces the
standard type set (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
`chore`, `ci`, `build`, `revert`), lower-case subjects, and a 72-character header
limit. No custom `rules` block is needed.

**Installation:**

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```
