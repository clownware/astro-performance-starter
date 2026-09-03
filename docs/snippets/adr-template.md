---
title: ADR template
description: >-
  Mirror of the canonical ADR template in docs/adr/template.md. All new ADRs
  must follow this structure.
lastUpdated: true
tableOfContents: true
pagefind: true
---

:::note
The canonical ADR template lives at [`docs/adr/template.md`](/adr/template/).
Copy that file when creating a new ADR — this snippet mirrors it for reference.
:::

````markdown
---
title: ADR Template
lastUpdated: 2025-06-10T00:00:00.000Z
description: >-
  Canonical template for Architectural Decision Records (ADRs) in this project.
  All new ADRs must follow this structure.
tableOfContents: true
pagefind: false
---

<!--
  USAGE: Copy this template to create a new ADR.
  
  File naming: NNN-kebab-case-title.md (e.g., 009-caching-strategy.md)
  
  Frontmatter requirements:
    title: 'ADR-NNN: Title Here'        (hyphenated ADR-NNN prefix)
    description: >-                      (multi-line YAML string, no markdown)
      Plain text summary of the decision
    lastUpdated: YYYY-MM-DDT00:00:00.000Z  (ISO date, not boolean)
    tableOfContents: true
    pagefind: true

  Body rules:
    - First heading must be h2 (## Status), never h1
    - No emoji in section headers
    - Use plain text for Status values (Proposed, Accepted, Superseded by ADR-NNN, Withdrawn).
      A parenthetical qualifier after the canonical word is allowed, e.g.
      "Proposed (aspirational)", "Proposed (deferred — revisit trigger)",
      "Accepted (amended YYYY-MM-DD: summary)". Only the canonical word carries
      binding force (see docs/adr/README.md).
    - Use pnpm (never npm) in all script references
    
  Architecture diagrams (optional):
    Use Mermaid for flowcharts, sequence diagrams, etc.
    See: https://mermaid.js.org/syntax/ for syntax reference.
-->

## Status

[Proposed | Accepted | Superseded by ADR-NNN | Withdrawn]

## Context

What is the issue that we're seeing that is motivating this decision or change? Provide enough context so that someone reading this in the future understands the "why" behind the decision.

## Decision Drivers

- **Driver 1**: [e.g., Performance requirements]
- **Driver 2**: [e.g., Developer experience]
- **Driver 3**: [e.g., Maintenance burden]
- **Driver 4**: [e.g., Cost considerations]

## Considered Options

### Option 1: [Name]

**Description**: Brief description of this approach

**Pros**:

- Advantage 1
- Advantage 2

**Cons**:

- Disadvantage 1
- Disadvantage 2

### Option 2: [Name]

**Description**: Brief description of this approach

**Pros**:

- Advantage 1
- Advantage 2

**Cons**:

- Disadvantage 1
- Disadvantage 2

### Option 3: [Name]

**Description**: Brief description of this approach

**Pros**:

- Advantage 1
- Advantage 2

**Cons**:

- Disadvantage 1
- Disadvantage 2

## Decision

We will go with **Option X** because [justification].

### Implementation Details

```typescript
// Include code examples if relevant
const example = 'implementation details';
```

## Consequences

### Positive

- What becomes easier or better as a result of this change
- Performance improvements expected
- Developer experience improvements

### Negative

- What becomes more difficult
- Technical debt we're accepting
- Additional complexity introduced

### Neutral

- Things that change but aren't necessarily better or worse
- Migration requirements
- Training needs

## Validation

How will we know if this decision was correct?

- **Metric 1**: [e.g., Bundle size remains under 160KB]
- **Metric 2**: [e.g., Build time under 2 minutes]
- **Metric 3**: [e.g., Developer satisfaction survey]

## References

- [Link to relevant documentation]
- [Link to proof of concept]
- [Link to benchmark results]
- [Link to team discussion]

## Notes

Additional implementation notes, migration strategies, or other relevant information that doesn't fit in the sections above.

---
**Date**: YYYY-MM-DD\
**Participants**: [List of people involved in the decision]\
**Outcome**: [Accepted | Rejected | Deferred]
````
