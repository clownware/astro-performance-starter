# Architecture Decision Records

This directory is the **template's** architecture decision log. Each ADR captures
one decision — its context, the options weighed, the choice, and the consequences.

## Provenance — what a cloner inherits

ADRs `000`–`060` are the **founding architecture of the Astro Performance Starter
itself**, recorded by the template's maintainers. When you clone this template:

- These records explain _why the starter is built the way it is_. They are the
  rationale behind the defaults you inherit — not decisions your project made.
- The `Participants` field on inherited ADRs names the **template maintainers**,
  not you.
- **Start your own log at the next free number** so your project's decisions are
  distinguishable from the inherited ones. Keep, amend, or supersede the
  inherited ADRs as your project diverges.

## Status values

| Status | Meaning |
|--------|---------|
| **Accepted** | In force. Accepted ADRs are **binding** for the AI constitution — the agent halts on violation (see [ADR-039](039-halt-on-violation-enforcement.md)). |
| **Proposed** | Not (yet) binding. Common qualifiers: **(aspirational)** — guidance a cloner _may_ adopt; **(deferred — trigger)** — parked until the stated trigger fires. Never enforced by `quality:ci` or the halt gate. |
| **Superseded** | Replaced by a later ADR (forward link required) or, exceptionally, by an upstream/config change explained in the status note. Kept for history. |
| **Withdrawn** | No longer in force and nothing replaced it — including reserved number stubs ([007](007-reserved.md), [016](016-reserved.md), [041](041-reserved.md)) and decisions retracted after audit (e.g. [006](006-documentation-review-cadence.md)). |

These four are the only canonical status words. A parenthetical qualifier after the word
(e.g. "Accepted (amended 2026-07-05: …)") adds nuance but never changes which row applies —
binding force follows the canonical word alone.

## Conventions

- **Never renumber or delete** an ADR. Supersede it with a new record and
  cross-link both directions (or, when the replacement is an upstream/config change
  with no record of its own, explain it in the status note), or mark it Withdrawn.
- Gaps in the sequence are documented as `NNN-reserved.md` stubs, never left silent.
- New records follow [`template.md`](template.md).

## Index

The full, always-current list is the file listing in this directory (and the
rendered docs site). Browse `0NN-*.md` in order; reserved numbers are explicit stubs.
