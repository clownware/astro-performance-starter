---
title: 'ADR-046: Security Scanning Pipeline (SAST + Secret Scanning)'
description: >-
  Add Semgrep static analysis and gitleaks secret scanning as halt-on-violation
  CI gates, alongside the existing pnpm audit and Trivy SBOM steps, with a
  committed gitleaks allowlist for documented false positives.
lastUpdated: 2026-05-28T00:00:00.000Z
tableOfContents: true
pagefind: true
---

## Status

Accepted

## Context

An external automated security assessment (2026-05-21) scanned the public site and the
source tree. Of its twelve findings, only two were real defects, but both were in source
that our existing CI never inspected for code-level patterns:

- `scripts/src/audit-filter.ts` invoked `spawnSync(..., { shell: true })` — flagged by a
  Semgrep `spawn-shell-true` rule we do not run.
- `scripts/src/build-tokens.ts` walked a reference path with `part in resolvedValue`,
  matching a Semgrep prototype-pollution rule we do not run.

Both were remediated directly. The gap they exposed is the point of this ADR: CI today runs
`pnpm run audit:ci` (dependency advisories) and a Trivy filesystem SBOM scan, but **no
static analysis of our own code and no secret scanning**. The assessment's only code-level
findings were therefore invisible to our pipeline until an external tool surfaced them.

The assessment also produced a secret-scanner false positive: gitleaks' `generic-api-key`
rule matched the substring `Toke` inside the prop name `tokenName` in
`src/pages/showcase.astro`. A regression guard that we own must be able to record such a
match as a known, justified false positive rather than failing the build forever — mirroring
how [`.audit-allowlist.json`](../../.audit-allowlist.json) records accepted dependency
advisories with a reason and an expiry.

Per Constitution Rule 1, adding a new always-on CI gate is an architectural change and
requires an ADR. Per [ADR-039](039-halt-on-violation-enforcement.md), a new gate must use
halt-on-violation semantics — the scan step exits non-zero on a finding and fails the build,
not merely annotates it.

## Decision Drivers

- **Regression prevention**: the two real findings must not be reintroducible silently.
- **Halt-on-violation alignment**: gates fail the build (ADR-039), they do not advise.
- **Zero-config-first**: the project is a static template; tooling should run with curated
  rulesets and no paid backend or account.
- **False-positive governance**: a committed, reviewable allowlist with traceable rationale,
  consistent with the `.audit-allowlist.json` pattern.
- **CI-only cost**: scanning belongs in CI, not on every local commit — `.husky/pre-commit`
  already runs `lint-staged` and must stay fast.

## Considered Options

### Option 1: Semgrep + gitleaks (curated rulesets, CI gates)

**Description**: Add a Semgrep job (`p/javascript`, `p/typescript`, `p/secrets`) and a
gitleaks job, both failing the build on findings. A committed `.gitleaks.toml` records
justified false positives.

**Pros**:

- Semgrep's registry rulesets include the exact `spawn-shell-true` and prototype-pollution
  rules that caught the real findings — direct regression coverage.
- gitleaks runs offline with a committed config; no account or hosted backend.
- Both upload SARIF to the existing GitHub code-scanning surface (permissions already grant
  `security-events: write`).

**Cons**:

- Two more CI steps and ~30–60s of wall time per run.
- Registry rulesets evolve upstream; a new rule can change pass/fail between runs.

### Option 2: GitHub CodeQL

**Description**: Enable CodeQL default setup for JavaScript/TypeScript.

**Pros**:

- First-party GitHub integration, strong dataflow analysis.

**Cons**:

- Heavier (build/database step), slower, and oriented to application dataflow rather than the
  lint-style pattern rules (`shell: true`, prototype-pollution loop) that matched here.
- No secret-scanning component — would still need gitleaks alongside it.

### Option 3: Do nothing (rely on external assessments)

**Description**: Keep `pnpm audit` + Trivy; depend on periodic external scans.

**Pros**:

- No new CI surface or maintenance.

**Cons**:

- The two real findings were invisible to our pipeline until an outside tool ran — this is
  precisely the failure mode to close.
- No mechanism to record the gitleaks false positive as accepted.

## Decision

We will go with **Option 1**. Semgrep's curated rulesets give direct regression coverage for
the two findings that motivated this work, gitleaks adds the missing secret-scanning layer,
and both run offline as halt-on-violation gates. CodeQL's dataflow strength is a poor match
for the pattern-level findings here and adds disproportionate build cost for a static
template; doing nothing re-opens the exact gap the assessment exposed.

### Implementation Details

Two jobs are added to [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml), parallel to
`build-test`. Each runs in its tool's official container and fails the build on findings (no
`continue-on-error`):

```yaml
semgrep:
  name: Semgrep SAST
  runs-on: ubuntu-latest
  if: github.actor != 'dependabot[bot]'
  container:
    image: semgrep/semgrep
  steps:
    - uses: actions/checkout@v5
    - run: semgrep scan --config p/javascript --config p/typescript --config p/secrets --error

gitleaks:
  name: Secret scan
  runs-on: ubuntu-latest
  if: github.actor != 'dependabot[bot]'
  container:
    image: ghcr.io/gitleaks/gitleaks:v8.30.1
  steps:
    - uses: actions/checkout@v5
    - run: gitleaks dir . --config .gitleaks.toml --exit-code 1 --verbose
```

Why containers rather than marketplace actions: Semgrep's own CI guidance mandates the
`semgrep/semgrep` image (do not substitute), and `semgrep scan --error` exits non-zero on
findings without requiring a `SEMGREP_APP_TOKEN`. For secrets, the `gitleaks/gitleaks-action`
requires a paid license on **organization**-owned repos; running the gitleaks CLI from its
container sidesteps that entirely while staying fully open-source. The `dependabot[bot]` guard
matches Semgrep's published sample — dependabot PRs touch only manifests and run with a
restricted token.

False positives are governed by a committed [`.gitleaks.toml`](../../.gitleaks.toml). Its
initial entry allowlists the `generic-api-key` match on Astro component prop names (e.g.
`tokenName`/`cssVar`) via a line regex, with a comment referencing the 2026-05-21 assessment
and this ADR. New allowlist entries require the same rationale-and-traceability discipline as
`.audit-allowlist.json`.

## Consequences

### Positive

- The `shell: true` and prototype-pollution patterns cannot be reintroduced without failing
  CI.
- Secrets committed to source are caught before merge, not by an external scan afterwards.
- Findings surface in the GitHub code-scanning tab via SARIF.

### Negative

- ~30–60s added per CI run.
- Upstream ruleset changes can flip a build from green to red on an unchanged tree; resolution
  is a code fix or a reviewed `.gitleaks.toml` / Semgrep inline-ignore entry, never blanket
  suppression.

### Neutral

- Local `pnpm quality:ci` is unchanged; these gates are CI-only by design. A contributor can
  run Semgrep/gitleaks locally but is not required to.
- `SECURITY.md` lists the full in-CI tooling set and is updated alongside this change.

## Validation

- **Regression coverage**: reintroducing `shell: true` in `audit-filter.ts` or `part in
  resolvedValue` in `build-tokens.ts` fails the Semgrep step.
- **Secret coverage**: a planted dummy secret fails the gitleaks step; the known
  `tokenName` match in `showcase.astro` does not.
- **No false-gate**: CI is green on a clean tree after the steps are added.

## References

- [ADR-039: Halt-on-Violation Enforcement](039-halt-on-violation-enforcement.md)
- [Constitution Rule 1 — architectural changes require an ADR](../../CLAUDE.md)
- [`.audit-allowlist.json`](../../.audit-allowlist.json) — parallel allowlist pattern
- [`.gitleaks.toml`](../../.gitleaks.toml) — secret-scan false-positive allowlist
- [Semgrep registry rulesets](https://semgrep.dev/explore)
- [gitleaks-action](https://github.com/gitleaks/gitleaks-action)

## Notes

The motivating assessment's other findings required no code change: TLS cipher suites and the
absence of HTTP Basic Auth are GitHub Pages platform concerns, and the "form discovered"
entries are crawler attack-surface mapping. These are documented as known not-applicable in
[`SECURITY.md`](../../SECURITY.md) so future scans do not refile them.

---
**Date**: 2026-05-28\
**Participants**: Chris Pezza\
**Outcome**: Accepted
