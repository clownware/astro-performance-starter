---
title: ADR template
description: 'Template for Architecture Decision Records'
lastUpdated: true
tableOfContents: true
pagefind: true
---

````markdown
:::caution 🚧 Work in progress
This is an ADR template stub. For finalized decisions, see the [Project Roadmap](../README.md#roadmap) or [Implementation Roadmap](../implementation-guides).
:::

# ADR-XXX: [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-XXX]

## Context
What is the issue that we're seeing that is motivating this decision or change? Provide enough context so that someone reading this in the future understands the "why" behind the decision.

<!--
  Contributors: Add an architecture diagram below if relevant. Use Mermaid for flowcharts, sequence diagrams, etc.
  See: https://mermaid.js.org/syntax/ for syntax reference.
-->

```mermaid
%% Example: Replace with your diagram
graph TD
  A[User] -->|Request| B[App]
  B -->|Response| A
````

## Decision Drivers

* Driver 1
* Driver 2
* Driver 3

## Considered Options

### Option 1: \[Name]

**Description**: Brief description of this approach

**Pros**:

* Advantage 1
* Advantage 2

**Cons**:

* Disadvantage 1
* Disadvantage 2

### Option 2: \[Name]

**Description**: Brief description of this approach

**Pros**:

* Advantage 1
* Advantage 2

**Cons**:

* Disadvantage 1
* Disadvantage 2

## Decision

We will go with **Option X** because \[justification].

### Implementation Details

```typescript
// Include code examples if relevant
const example = 'implementation details';
```

## Consequences

### Positive

* What becomes easier or better as a result of this change

### Negative

* What becomes more difficult or worse as a result of this change

### Neutral

* Other implications that are neither clearly positive nor negative

## Follow-up Actions

* \[ ] Action item 1
* \[ ] Action item 2

## References

* [Link 1](/snippets/url/)
* [Link 2](/snippets/url/)
