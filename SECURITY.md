# Security Policy

## Reporting a Vulnerability

If you discover a security issue in this template, please report it privately rather
than opening a public issue:

- **Preferred:** open a [private security advisory](https://github.com/clownware/astro-performance-starter/security/advisories/new) on GitHub.
- **Email:** <chris@chrispezza.com>

Please include reproduction steps and the affected file or route. We aim to acknowledge
reports within a few days.

## Scope

This repository is a **static** Astro site deployed to GitHub Pages
(`output: 'static'`). There is no application server, no database, and no runtime
request handling under our control. Build-time scripts in `scripts/src/` run on trusted
developer and CI machines using repo-committed inputs.

## In-CI Security Tooling

Every pull request runs the following gates (see [`.github/workflows/ci.yml`](.github/workflows/ci.yml)):

- **Dependency audit** — `pnpm run audit:ci` (`pnpm audit --prod` filtered through
  [`.audit-allowlist.json`](.audit-allowlist.json), which documents and time-bounds each
  accepted transitive advisory).
- **Trivy** — filesystem SBOM scan, results uploaded as SARIF.
- **Semgrep** — SAST (`p/javascript`, `p/typescript`, `p/secrets`). See
  [ADR-046](docs/adr/046-security-scanning-pipeline.md).
- **gitleaks** — secret scanning, configured by [`.gitleaks.toml`](.gitleaks.toml).

## Known Not-Applicable Findings

Automated scanners run against the public `*.github.io` URL routinely surface the
following. They are **not fixable from this repository** and are documented here so they
are not refiled:

- **TLS cipher suites without forward secrecy.** TLS termination for `*.github.io` is
  managed entirely by GitHub. Cipher policy is not configurable from this repo, and
  forward-secret (ECDHE) ciphers are already offered alongside the flagged legacy suites.
- **"HTTP Basic Auth brute-force success."** GitHub Pages serves no HTTP Basic Auth on
  this site. Tools such as hydra interpret the unconditional `200` response to any
  request as an authentication success; there is no credential to compromise.

These were both reported by an automated assessment on 2026-05-21 and confirmed
not-applicable on review.
