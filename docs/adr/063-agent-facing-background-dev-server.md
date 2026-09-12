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

Accepted (amended 2026-09-12: extended to `astro preview`. The E2E suite starts the preview
server with the explicit `--background` flag Astro 7.2 added and stops only the pid it
started — see "Preview server" under Implementation Details. The dev-server decision is
unchanged.)

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

> **Amendment (2026-09-08).** The collision recurred a third time, and the mechanism turned out to
> be this same detaching behaviour rather than the port alone. Playwright's `webServer` launched
> `astro preview`, which detached; the launcher exited immediately, so Playwright either aborted
> with "Process from config.webServer exited early" or won a race against the detached server
> binding its port — and, never having owned the process, could not stop it afterwards. Every E2E
> run therefore leaked a background preview daemon, and later runs silently adopted whatever was
> still listening.
>
> The E2E path no longer uses `webServer`. `e2e/global-setup.ts` owns start, readiness, identity
> and shutdown: it moves off the contended 4321 default (`E2E_PORT`, default 4351), reuses a
> server only after confirming it serves this application's routes, refuses to run against
> anything else, and stops only a server it started itself. Liveness is still not identity — that
> part of this ADR stands — which is exactly why the check probes real routes instead of
> `/_astro/status`.

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

### Preview server (amendment 2026-09-12)

Astro 7.2 gave `astro preview` the same background mode (`--background`, `stop`, `status`,
`logs`, lock file `.astro/preview.json`). Under an agent environment Astro applies it
automatically, which is why `e2e/global-setup.ts` used to observe the server "detaching on
some platforms" and had to spawn it detached and cover both shapes at teardown. The launcher
now passes `--background` explicitly, so the shape is the same in a terminal, under an agent
and in CI:

```bash
pnpm exec astro preview --background --port 4351   # returns once listening; writes .astro/preview.json
pnpm exec astro preview status
pnpm exec astro preview stop                        # stops the lock's pid, whichever port
```

Two upstream facts shape the contract:

- **One lock per project.** A second `--background` on any port reports the running server
  instead of starting another. The E2E launcher therefore refuses to run while a live lock
  points at a different port (an LHCI run on 4321, a preview left open in a terminal) and
  says how to stop or reuse it, rather than silently testing the wrong server.
- **`--ignore-lock` is foreground-only** and is rejected outright under agent detection, so it
  is not an escape hatch for the suite.

Teardown stops the server only while the lock still holds the pid the run started, so a
preview a human started for another purpose is never killed by a test run.

## Consequences

### Positive

- Agents manage the dev server lifecycle with two scripts and structured output
- The port-collision trap is documented at the exact place agents read before starting servers
- Zero dependencies, zero runtime code, zero config changes

### Negative

- Two more scripts in the everyday section (accepted trade under ADR-052)
- The contract tracks upstream CLI behavior; an Astro change to the subcommands would need a
  doc update (drift is caught by humans, not a gate — accepted for a two-line surface)

## Enforcement

<!-- Added 2026-08-13 under the enforcement architecture ADR (ADR-064). The original record above is unmodified. -->

- **Testable consequences:**
  - TC-1: `dev:agent` and `dev:agent:stop` exist in `package.json` and wrap the documented `astro dev` subcommands.
- **Checks:**
  - TC-1 → check `script-contract` (status: **warn**)
- **Not machine-checkable:** upstream CLI behavior drift is caught by humans, not a gate (accepted above for a two-line surface). The preview launcher's two paths (refuse while a foreign-port lock is live; stop only its own pid) were exercised by hand on 2026-09-12 and are covered by every E2E run, not by a dedicated check.
- **Graduation log:** *(empty at creation; entries added when a check changes status)*
