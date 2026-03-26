---
title: 'ADR-004: Optional Design System Tooling for MVP Track'
description: >-
  Makes design token build and contrast validation steps optional via environment
  variable to improve CI/CD performance and developer experience for MVP users
lastUpdated: 2025-06-10T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Superseded — the `build:mvp` script described in this ADR was never implemented. The MVP/Showcase track distinction was consolidated into a progressive tier model by [ADR-033: Track Consolidation](/adr/033-track-consolidation/). Design system tooling is now uniformly enabled with no skip mechanism needed.

## Context

The Astro starter template includes robust design system tooling, specifically a script to build design tokens (`scripts/build-tokens.ts`) and a contrast validator to ensure WCAG AA compliance for color combinations. These tools are highly beneficial for projects intending to deeply customize the design system or for teams adhering to strict design standards (i.e., the "Showcase" track).

However, for users on the "MVP" (Minimum Viable Product) track, who may prioritize rapid deployment with minimal customization and may not interact deeply with the token system, these steps can add unnecessary overhead:

- Increased CI/CD pipeline duration.
- Additional local build time.
- Potential setup complexity if they don't intend to modify tokens.

This ADR proposes making these design system tooling steps optional to improve the developer experience for MVP adopters.

## Decision Drivers

- **Developer Experience (DX)**: Reduce friction and build times for users who don't need advanced design system features.
- **CI/CD Performance**: Speed up CI pipelines for the MVP track.
- **Flexibility**: Allow users to opt-in to advanced tooling based on their project needs.
- **Track Differentiation**: Further distinguish the MVP and Showcase tracks by tailoring the default tooling set.
- **Reduced Complexity**: Simplify the initial experience for users aiming for a quick start.

## Considered Options

1. **Environment Variable Control (e.g., `SKIP_DESIGN_SYSTEM_TOOLING=true`)**
    - **Pros**: Relatively simple to implement in scripts and CI. Allows fine-grained control if multiple tools are to be skipped. Standard practice for conditional script execution.
    - **Cons**: Users need to know about and manage the environment variable. Less discoverable than explicit scripts.

2. **Separate npm Scripts (e.g., `build:mvp` vs. `build`, `lint:mvp` vs. `lint`)**
    - **Pros**: Very explicit and discoverable. Easy for users to choose the desired workflow.
    - **Cons**: Can lead to a proliferation of scripts in `package.json` if many variations are needed.

3. **CLI Flag during Project Initialization (e.g., `npx create-astro-starter --track=mvp`)**
    - **Pros**: Integrates the choice into the initial setup. Can configure multiple aspects of the project based on the track.
    - **Cons**: Requires a dedicated CLI tool or a more complex initialization script, which is a larger undertaking than just modifying existing scripts.

4. **Configuration File Setting (e.g., a flag in `astro.config.mjs` or a project config file)**
    - **Pros**: Persistent setting. Easy for users to change.
    - **Cons**: Scripts would need to read this configuration, adding a bit more complexity. Might not be suitable for CI where different configurations are run.

## Decision

**Option 1 (Environment Variable Control) is chosen as the primary mechanism, potentially combined with Option 2 (Separate npm Scripts) for user convenience.**

- An environment variable, `SKIP_DESIGN_SYSTEM_TOOLING=true`, will be introduced.
- Core scripts (e.g., the main build script, linting scripts, CI job steps) will be modified to check for this environment variable. If set to `true`, the design token build (`scripts/build-tokens.ts`) and the contrast validation steps will be skipped.
- For ease of use, wrapper npm scripts can be added to `package.json`:
  - `pnpm run build` (or `pnpm run build:showcase`): Runs all steps, including design system tooling.
  - `pnpm run build:mvp`: Sets `SKIP_DESIGN_SYSTEM_TOOLING=true` and then runs the build process.
  - Similar pairs for `lint` or `test` if applicable.
- The default CI configuration for a potential "MVP track" workflow will set `SKIP_DESIGN_SYSTEM_TOOLING=true`.

This approach offers a balance of implementation simplicity, flexibility for CI, and user-friendliness through optional wrapper scripts.

A CLI flag during project initialization (Option 3) is a desirable future enhancement for a more integrated setup experience but is out of scope for the immediate implementation of this ADR.

## Consequences

### Positive

- Faster CI/CD runs for MVP users or scenarios where design system customization is not a priority
- Simpler local development setup for MVP users
- Clearer distinction in tooling between MVP and Showcase tracks

### Negative

- `package.json` scripts need to be updated
- The token build script (`scripts/build-tokens.ts`) and the contrast validation logic need to be modified to respect the environment variable
- CI workflow files (e.g., `.github/workflows/ci.yml`) need to be updated to set this variable for MVP-specific jobs or provide ways to trigger MVP builds
- If these tools are skipped, the project will rely on default/pre-built tokens; users choosing the MVP path must be aware that direct token modification or extensive theme changes might require running the full tooling

### Neutral

- Documentation (the onboarding guide, the roadmap, relevant phase guides, and potentially a new "Customization" guide) must clearly explain this option, the environment variable, and the available pnpm scripts

## Validation

- CI jobs for the MVP track should demonstrate faster completion times.
- Running `pnpm run build:mvp` (or equivalent) should result in a successful build without executing the token build and contrast validation steps.
- Documentation clearly explains how to utilize this optional tooling.

## References

- Internal: `docs/implementation-guides/01-foundation-phase-2-design-system.md` (mentions token build and WCAG checks)
- Internal: `scripts/build-tokens.ts` (and the contrast validation script/logic)

---
**Date**: 2025-06-10\
**Participants**: Template maintainers\
**Outcome**: Accepted
