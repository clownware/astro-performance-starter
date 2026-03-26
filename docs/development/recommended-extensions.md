---
title: Recommended VS Code Extensions
description: Essential VS Code extensions for optimal developer experience with the Astro Performance Starter
lastUpdated: 2025-09-30
pagefind: true
---

# Recommended VS Code Extensions

This project includes a `.vscode/extensions.json` file that automatically prompts you to install recommended extensions when you open the workspace in VS Code.

## Essential Extensions

### Core Development

#### Astro Language Support

**Extension ID:** `astro-build.astro-vscode`

Official Astro extension providing:

- Syntax highlighting for `.astro` files
- IntelliSense and autocomplete
- TypeScript integration
- Component prop validation
- Diagnostic messages

**Why it's essential:** Required for proper Astro development experience.

---

#### Biome

**Extension ID:** `biomejs.biome`

Fast formatter and linter that replaces ESLint + Prettier.

**Features:**

- 20x faster than ESLint + Prettier combined
- Unified formatting and linting
- Automatic code fixes
- Integrated with project's `biome.json` config

**Why it's essential:** This project uses Biome exclusively for code quality. ESLint and Prettier are explicitly not used.

**Configuration:** See `biome.json` in project root.

---

#### Tailwind CSS IntelliSense

**Extension ID:** `bradlc.vscode-tailwindcss`

**Features:**

- Autocomplete for Tailwind classes
- CSS preview on hover
- Linting for class names
- Design token integration

**Why it's essential:** Provides autocomplete for custom design tokens defined via `@theme inline` in `src/styles/global.css`.

---

### Content & Documentation

#### MDX Language Support

**Extension ID:** `unifiedjs.vscode-mdx`

**Features:**

- Syntax highlighting for `.mdx` files
- JSX component support in markdown
- IntelliSense for imported components

**Why it's essential:** This project uses MDX extensively for content with Astro Content Collections.

---

#### Markdownlint

**Extension ID:** `davidanson.vscode-markdownlint`

**Features:**

- Markdown linting and style checking
- Auto-fix on save
- Integrated with `.markdownlint-cli2.jsonc`

**Why it's essential:** Enforces consistent markdown style across documentation.

**Configuration:** See `.markdownlint-cli2.jsonc` in project root.

---

### Developer Experience

#### EditorConfig

**Extension ID:** `editorconfig.editorconfig`

**Features:**

- Enforces consistent coding styles
- Works across different editors
- Respects `.editorconfig` file

**Why it's essential:** Ensures consistent indentation, line endings, and encoding.

**Configuration:** See `.editorconfig` in project root.

---

#### Path Intellisense

**Extension ID:** `christian-kohler.path-intellisense`

**Features:**

- Autocomplete for file paths
- Works with TypeScript path aliases (`@/*`, `@components/*`, etc.)
- Preview on hover

**Why it's essential:** Speeds up imports with project's absolute path aliases.

---

#### Error Lens

**Extension ID:** `usernamehw.errorlens`

**Features:**

- Inline error and warning display
- Highlights entire error lines
- Reduces need to check Problems panel

**Why it's essential:** Improves debugging speed with immediate visual feedback.

---

### Version Control

#### GitLens

**Extension ID:** `eamodio.gitlens`

**Features:**

- Git blame annotations
- Commit history visualization
- File history and comparison
- Repository insights

**Why it's essential:** Enhanced Git integration for collaborative development.

---

### Accessibility

#### axe Accessibility Linter

**Extension ID:** `deque-systems.vscode-axe-linter`

**Features:**

- Real-time accessibility linting
- WCAG compliance checking
- Inline suggestions

**Why it's essential:** This project targets WCAG AA compliance. Catch a11y issues during development.

---

## Unwanted Extensions

The following extensions are **not recommended** and may conflict with project tooling:

### ❌ Prettier

**Extension ID:** `esbenp.prettier-vscode`

**Why not:** This project uses Biome for formatting. Prettier is redundant and may cause conflicts.

---

### ❌ ESLint

**Extension ID:** `dbaeumer.vscode-eslint`

**Why not:** This project uses Biome for linting. ESLint is not configured.

---

## Installation

### Automatic (Recommended)

1. Open the project in VS Code
2. Click "Install" when prompted to install recommended extensions
3. Reload VS Code when installation completes

### Manual

1. Open Command Palette (`Cmd/Ctrl + Shift + P`)
2. Type "Extensions: Show Recommended Extensions"
3. Click "Install Workspace Recommended Extensions"

---

## Workspace Settings

Consider adding these settings to `.vscode/settings.json` for optimal experience:

```json
{
  // Biome as default formatter
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },

  // Tailwind CSS
  "tailwindCSS.experimental.configFile": "src/styles/global.css",
  "tailwindCSS.experimental.classRegex": [
    ["class:\\s*?[\"'`]([^\"'`]*).*?[\"'`]", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],

  // File associations
  "files.associations": {
    "*.css": "tailwindcss"
  },

  // Astro
  "astro.typescript.enabled": true,

  // Markdown
  "markdownlint.config": {
    "extends": ".markdownlint-cli2.jsonc"
  }
}
```

---

## Troubleshooting

### Extensions Not Prompting

If VS Code doesn't prompt to install extensions:

1. Open Command Palette
2. Run "Extensions: Show Recommended Extensions"
3. Manually install from the list

### Biome Not Formatting

1. Ensure Biome extension is installed and enabled
2. Check that `editor.defaultFormatter` is set to `biomejs.biome`
3. Verify `biome.json` exists in project root
4. Restart VS Code

### Tailwind Autocomplete Not Working

1. Ensure `src/styles/global.css` contains `@import 'tailwindcss'`
2. Check that Tailwind CSS extension is enabled
3. Run "Tailwind CSS: Show Output" to check for errors
4. Restart TypeScript server: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

---

## Related Documentation

- [Contributing Guidelines](./CONTRIBUTING.md)
- [Git Workflow](./git-workflow.md)
- [Custom Scripts](./custom-scripts.md)
- [Design Tokens](./how-to-use-design-tokens.md)
