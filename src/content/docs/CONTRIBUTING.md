---
title: CONTRIBUTING
description: '***'
last_reviewed_on: '2025-07-01'
---

***

title: Contributing Guide
version: 1.0.0
lastUpdated: 2025-06-19T00:00:00.000Z
description: >-
How to contribute to the Astro Performance Starter Template, with a focus on
version management and documentation consistency.
-------------------------------------------------

# Contributing to the Astro Performance Starter Template

Thank you for your interest in contributing! This project aims to set a new standard for performance, maintainability, and developer experience in Astro-based static sites. Please review the guidelines below before submitting a pull request.

## 🚦 Version Management System (DRY & Future-Proof)

This project uses a **centralized version injection system** to keep all documentation and code examples up-to-date and DRY. All version numbers for tools, frameworks, and dependencies are managed in a single YAML file:

* `docs/meta/versions.yml` — **Single source of truth for versions**

### How It Works

* **Placeholders** like `{{versions.astro}}`, `{{versions.tailwindcss}}`, etc. are used throughout all documentation and code examples instead of hardcoded version numbers.
* During the Astro build, a custom remark/rehype plugin automatically injects the actual version numbers from `versions.yml` wherever placeholders are found.
* The CLI script `scripts/update-versions.ts` can auto-update `versions.yml` by detecting installed versions, or you can update it manually.

### Contributor Responsibilities

* **Never** hardcode version numbers in documentation, guides, or code examples. Always use the appropriate placeholder, e.g. `{{versions.node}}`.
* When adding new documentation or updating existing files, check for any version references and use placeholders.
* If you add a new tool or dependency that should be tracked, add it to `versions.yml` and use a new placeholder (e.g. `{{versions.newtool}}`).
* If you update a dependency, run `pnpm tsx scripts/update-versions.ts` to sync `versions.yml`.

### Common Placeholders

| Tool/Dependency   | Placeholder                |
|-------------------|---------------------------|
| Astro             | `{{versions.astro}}`       |
| Tailwind CSS      | `{{versions.tailwindcss}}` |
| Node.js (LTS)     | `{{versions.node}}`        |
| pnpm              | `{{versions.pnpm}}`        |
| Biome             | `{{versions.biome}}`       |
| TypeScript        | `{{versions.typescript}}`  |
| Preact            | `{{versions.preact}}`      |
| Playwright        | `{{versions.playwright}}`  |
| Vitest            | `{{versions.vitest}}`      |
| Sharp             | `{{versions.sharp}}`       |
| Lighthouse CI     | `{{versions.lighthouse-ci}}`|
| ...               | ...                       |

## 🛠️ How to Update Versions

1. **Update dependencies** as needed (e.g. `pnpm up` or manual changes).
2. Run the update script:
   ```bash
   pnpm tsx scripts/update-versions.ts
   ```
   This will auto-detect installed versions and update `versions.yml`.
3. **Commit changes** to both `versions.yml` and any affected lockfiles.
4. **Check docs**: All version references in documentation should now be up-to-date via placeholders.

## 🧑‍💻 Documentation and PR Guidelines

* Write clear, concise, and technical documentation.
* Use functional, declarative patterns in code; avoid duplication.
* Follow the atomic design/component structure (see `/src/components`).
* Add tests or examples where appropriate.
* Reference relevant ADRs and design decisions when making structural changes.

## 🧩 Adding New Placeholders

* Add the new tool/version to `docs/meta/versions.yml`.
* Use the new placeholder in documentation: `{{versions.<key>}}`.
* If needed, update the remark/rehype plugin to support new keys.

## 🛡️ Linting & Formatting

* All code and markdown is linted/formatted with Biome (`pnpm biome check`).
* Please run checks before submitting your PR.

## 📚 Further Reading

* [docs/meta/versions.yml](/meta/versions/)
* [scripts/update-versions.ts](/scripts/update-versions/)
* [remark-inject-versions.mjs](/remark-inject-versions/)
* [ADR-000: Starter Decisions](/adr/000-starter-decisions/)

***

If you have questions or want to propose improvements to the versioning system, open an issue or discussion!
