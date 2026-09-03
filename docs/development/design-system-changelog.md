---
title: Design System Changelog
description: >-
  Tracks changes to the design system: token sources in tokens/, the generated
  CSS variables, and the theme mechanism.
lastUpdated: true
tableOfContents: true
pagefind: true
---

This document tracks changes to the design system — the token sources in `tokens/` (`base.json`, `semantic.json`), the generated `tokens/dist/tokens.css`, and the theme mechanism. The authoritative record for the current token model is [ADR-047](/adr/047-design-tokens-v2-role-based-naming/); this page is the short history.

## 2026-06-07 - Design system v2.1 tokens

### Changed

- **`success` moved to a dedicated green family** (`green-700` light / `green-400` dark); a full `green` 50–950 scale was added to `tokens/base.json`. Recorded as the v2.1 amendment to ADR-047.
- **Motion system applied across the site** using the `--motion-duration-*` / `--motion-ease-*` tokens (exposed as Tailwind `duration-*` / `ease-*` utilities via `@theme inline`).
- **Typography moved to the Astro Fonts API** ([ADR-053](/adr/053-fonts-via-astro-fonts-api/)): `--font-display` / `--font-text` in `global.css` now resolve to the Fonts API variables (`--font-geist`, `--font-inter`). The `fontFamily` token group in `tokens/base.json` and the generated `--font-family-*` variables still document the intended stack but no longer drive rendering.

### Added

- Two surface tiers: `surfaceRaised` (cards and popovers above `surface`) and `surfaceAccent` (violet-tinted emphasis panels).

## 2026-06-06 - Design tokens v2: role-based semantic naming

### Changed

- **Semantic layer renamed to role-based tokens** (`background`, `surface`, `foreground`, `mutedForeground`, `border`, `borderEmphasis`, `link`, single-token `success` / `warning` / `error`), replacing the tiered `background.primary` / `foreground.secondary` shape. Components were migrated with a scoped codemod; the utility rename map is in ADR-047.
- **Base palettes renamed**: `gray` → `slate`, `moonstone` → `violet`, `imperialRed` → `rose`, `orangeWeb` → `amber`.
- **Dark-first default**: with no stored preference the site renders dark; `prefers-color-scheme` no longer drives the default (amendment to [ADR-032](/adr/032-dark-mode-strategy/)).

### Added

- `motion` token group (`duration.fast/base/slow`, `ease.in/out/inOut`) in `tokens/base.json`.
- `fontFamily` token group so typography is swappable like colour.

## 2026-04-12 - Dark mode contrast

### Changed

- Improved dark-mode contrast for cards and badges.

## 2026-03-27 - White / charcoal colour scheme

### Changed

- Light theme moved to a white / charcoal scheme with improved contrast (the pre-v2 naming; superseded by the role-based tokens above).

## 2025-09-30 - `--color-` prefix convention

### Changed

- All generated colour variables gained a consistent `--color-` prefix (base and semantic alike). The prefix convention still holds; the token *names* from this era were replaced by the v2 rename above.

### Removed

- An unused base colour that no semantic token referenced.

---

For how to consume and extend the tokens, see [Using Design Tokens](/development/how-to-use-design-tokens/).
