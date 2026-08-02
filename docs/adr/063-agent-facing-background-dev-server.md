---
title: 'ADR-063: Agent-Facing Background Dev Server Contract'
description: >-
  Expose Astro 7's background dev server as cloner-facing dev:agent /
  dev:agent:stop scripts and document the liveness contract (astro dev
  status/logs, the /_astro/status endpoint) so coding agents can manage the
  dev server without holding a terminal; the health endpoint is liveness-only
  and does not solve port-collision identification
lastUpdated: 2026-07-27T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

This template's differentiator is its agent-first workflow: a layered constitution, generated
`AGENTS.md`, and halt-on-violation gates. Coding agents working in cloned projects routinely need
a dev server they can start, verify, and stop programmatically — historically done by holding a
terminal open, parsing human-formatted logs, and guessing at readiness.

Astro 7 ships first-class support for exactly this workflow:

- `astro dev --background` starts the server as a detached background process and prints
  JSON-formatted status lines
- `astro dev stop`, `astro dev status`, and `astro dev logs [--follow]` manage it
- a `/_astro/status` health endpoint answers liveness (`{"ok":true}`)

All of the above was smoke-tested against astro 7.1.4 in this repository before adoption.

One capability limit matters: `/_astro/status` is **liveness-only**. It does not identify which
project is serving. This repository has twice been bitten by port-4321 collisions (Playwright's
`reuseExistingServer` and local Lighthouse both silently measured an unrelated site occupying the
port). The health endpoint does not fix that class of bug, and documentation claiming otherwise
would recreate it.

## Decision Drivers

- **Agent ergonomics**: start/verify/stop without a held terminal or log-scraping
- **Discoverability**: the capability exists in Astro 7 regardless; undocumented, cloned
  projects' agents won't find it (ADR-052 — the everyday surface must be obvious)
- **Honest contracts**: document what `/_astro/status` answers and what it does not
- **Minimal surface**: no new dependencies, no config changes, no runtime code

## Considered Options

### Option 1: Scripts + documented contract

**Description**: Add `dev:agent` / `dev:agent:stop` to the cloner-facing script section and
document the full contract (subcommands, health endpoint, port-collision caveat) in
`.claude/stack.md`, flowing into the generated `AGENTS.md`.

**Pros**:

- Two package.json lines and documentation; nothing to maintain beyond upstream Astro
- Agents in cloned projects discover the capability through `AGENTS.md`

**Cons**:

- Slightly widens the everyday script surface (ADR-052 traded exactly this against discoverability)

### Option 2: Do nothing — the flags exist upstream

**Description**: Rely on agents knowing Astro 7's CLI.

**Pros**:

- Zero surface added

**Cons**:

- Discoverability failure: agent context is built from `AGENTS.md`, not Astro's CLI help
- The port-collision caveat — the part that actually prevents bugs — would live nowhere

### Option 3: Full logHandlers.json() config integration

**Description**: Also wire `logHandlers.json()` into `astro.config.mjs` so all dev output is
structured JSON.

**Pros**:

- Machine-readable logs in every mode, not just background

**Cons**:

- Changes the human dev experience (`pnpm dev` output becomes JSON) to serve the agent case
  that `--background` already covers
- Config surface for a need not yet demonstrated

## Decision

We will go with **Option 1**. The scripts sit in the everyday section (ADR-052: cloner-facing
above the separator) because agents working in cloned projects are this template's primary
audience for them. Option 3 is available to any cloner in one config line if they want it;
defaulting it would trade human ergonomics for no additional agent capability.

### Implementation Details

```bash
pnpm dev:agent        # astro dev --background — detached, JSON status lines
pnpm dev:agent:stop   # astro dev stop
pnpm exec astro dev status   # running? pid?
pnpm exec astro dev logs --follow
curl -s http://localhost:4321/_astro/status   # {"ok":true} — liveness ONLY
```

The contract documented in `.claude/stack.md` (and therefore `AGENTS.md`) states explicitly:
`/_astro/status` proves *a* dev server answers on the port, not that it is *this project's*
server. Before driving tests against a port, agents must verify ownership (e.g. check
`astro dev status` reports a pid, or request a route unique to this site).

## Consequences

### Positive

- Agents manage the dev server lifecycle with two scripts and structured output
- The port-collision trap is documented at the exact place agents read before starting servers
- Zero dependencies, zero runtime code, zero config changes

### Negative

- Two more scripts in the everyday section (accepted trade under ADR-052)
- The contract tracks upstream CLI behavior; an Astro change to the subcommands would need a
  doc update (drift is caught by humans, not a gate — accepted for a two-line surface)
