# Documentation Snippets

This directory contains reusable code snippets and configuration blocks that are referenced across multiple documentation files.

## Usage

Snippets are embedded using the shortcode syntax:

```markdown
{% snippet "snippet-name" %}
```

## Available Snippets

| Snippet | Description | Used In |
|---------|-------------|---------|
| `git-hooks` | Husky + lint-staged setup | Phase 0, Phase 3, Tech Stack |
| `biome-config` | Complete Biome configuration | Phase 0, Phase 3, Tech Stack |
| `package-scripts` | Standard npm scripts configuration | Phase 0, Phase 3 |
| `mvp-scripts` | Minimal MVP package.json scripts section | MVP Track Guide |
| `tsconfig-paths` | TypeScript path mapping setup | Phase 0, Tech Stack |
| `adr-template` | Standard ADR structure template | Phase 0, ADR Template |
| `lint-staged-config` | Lint-staged configuration | Phase 3, Git Workflow |
| `commitlint-config` | Conventional commits setup | Phase 3, Git Workflow |

## Snippet Structure

Each snippet file should:
- Be standalone and complete
- Include necessary context comments
- Follow the project's code style
- Be version-agnostic where possible

## Maintenance

When updating a snippet:
1. Update the snippet file directly
2. Changes propagate automatically to all references
3. No need to update multiple documentation files
