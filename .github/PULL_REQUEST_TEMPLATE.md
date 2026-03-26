## What

<!-- Brief description of the change. Link to related issue if applicable. -->

## Why

<!-- Motivation: what problem does this solve or what value does it add? -->

## How

<!-- Implementation approach. Call out any non-obvious design decisions. -->

## Testing

- [ ] `pnpm run check` passes
- [ ] `pnpm run lint` passes
- [ ] Manual testing completed (describe below)

<!-- Describe any manual testing performed or automated tests added. -->

## Checklist

- [ ] Files added/modified are in the correct category per [ADR-035](../docs/adr/035-template-scope-boundary.md)
- [ ] Changes stay within [performance budgets](../docs/implementation-guides/reference/budgets-guardrails.md)
- [ ] No `client:load` added without ADR justification ([ADR-001](../docs/adr/001-preact-island-usage-policy.md))
- [ ] Design tokens used — no hardcoded colors or spacing values
- [ ] TypeScript strict mode satisfied
- [ ] Accessibility: ARIA labels and keyboard navigation included where applicable

## Screenshots

<!-- If UI changes, include before/after screenshots. Delete this section if not applicable. -->
