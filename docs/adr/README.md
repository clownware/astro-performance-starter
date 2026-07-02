# Architecture Decision Records

This directory is the **template's** architecture decision log. Each ADR captures
one decision — its context, the options weighed, the choice, and the consequences.

## Provenance — what a cloner inherits

ADRs `000`–`058` are the **founding architecture of the Astro Performance Starter
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
| **Proposed (aspirational)** | Recommended guidance a cloner _may_ adopt; **not** enforced by `quality:ci` or the halt gate. |
| **Superseded** | Replaced by a later ADR; kept for history with a forward link. |
| **Withdrawn / Reserved** | Number reserved to preserve the numbering audit trail (e.g. [007](007-reserved.md), [016](016-reserved.md), [041](041-reserved.md)). |

## Conventions

- **Never renumber or delete** an ADR. Supersede it with a new record and
  cross-link both directions, or mark it Withdrawn.
- Gaps in the sequence are documented as `NNN-reserved.md` stubs, never left silent.
- New records follow [`template.md`](template.md).

## Index

The full, always-current list is the file listing in this directory (and the
rendered docs site). Browse `0NN-*.md` in order; reserved numbers are explicit stubs.
