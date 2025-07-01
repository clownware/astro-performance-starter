---
title: commitlint config
description: "```js\r // commitlint.config.js\r export default {\r   extends: ['@commitlint/config-conventional'],\r   rules: {\r     'type-enum': [\r       2,\r       'always',"
lastUpdated: true
tableOfContents: true
pagefind: true
---
```js
// commitlint.config.js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New features
        'fix',      // Bug fixes
        'docs',     // Documentation changes
        'style',    // Code style changes (formatting, etc.)
        'refactor', // Code refactoring
        'perf',     // Performance improvements
        'test',     // Test changes
        'chore',    // Build process or auxiliary tool changes
        'ci',       // CI configuration changes
        'build',    // Build system changes
        'revert'    // Revert previous commit
      ]
    ],
    'subject-case': [2, 'never', ['upper-case']],
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100]
  }
};
```

**Installation:**

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```
