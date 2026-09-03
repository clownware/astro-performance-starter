---
title: AI Rules Configuration
description: Set up AI assistant rules for consistent project guidance
lastUpdated: true
tableOfContents: true
pagefind: true
---

> 🤖 **Purpose**: Configure AI assistants with project-specific rules for consistent guidance across every coding tool

## The cross-tool spine: AGENTS.md

This project uses the [AGENTS.md](https://agents.md) pattern (governed by the Agentic AI Foundation under the Linux Foundation) as the cross-tool spine for AI context. A single canonical `AGENTS.md` at the repo root is read natively by every modern AI coding tool. No per-tool overlay files ship: the only tool-specific file in the repo is [`CLAUDE.md`](https://github.com/clownware/astro-performance-starter/blob/master/CLAUDE.md), and it is a _source layer_ of the constitution ([ADR-036](/adr/036-layered-constitution/)), not a copy of it. (The former `.windsurfrules` overlay was removed — see the amendment note in [ADR-045](/adr/045-cross-tool-agents-spine/).)

**The maintenance contract is simple: never duplicate shared rules across tool files.** Edit the source layer, regenerate `AGENTS.md`, commit. CI fails on drift.

## How it works in this repo

`AGENTS.md` is a generated artifact. Its sources are the layered constitution established by [ADR-036](/adr/036-layered-constitution/):

| Source file | Contents | Update cadence |
|---|---|---|
| [`CLAUDE.md`](https://github.com/clownware/astro-performance-starter/blob/master/CLAUDE.md) | Halt-on-violation rules only (the constitution — kept under 30 lines) | Rare — major architectural shifts |
| [`.claude/engineering.md`](https://github.com/clownware/astro-performance-starter/blob/master/.claude/engineering.md) | Engineering defaults (components, tokens, TypeScript, naming) | When a pattern is reconsidered |
| [`.claude/workflow.md`](https://github.com/clownware/astro-performance-starter/blob/master/.claude/workflow.md) | Process (scope, quality gate, ADR discipline, testing) | When a process changes |
| [`.claude/stack.md`](https://github.com/clownware/astro-performance-starter/blob/master/.claude/stack.md) | Stack facts (versions, commands, budgets) | Every dependency bump |

The build ([`scripts/src/build-agents-md.ts`](https://github.com/clownware/astro-performance-starter/blob/master/scripts/src/build-agents-md.ts)):

```bash
pnpm agents:build     # regenerate AGENTS.md from the four sources above
pnpm agents:check     # fail if AGENTS.md is stale (runs in quality:ci)
```

The drift gate runs in `pnpm quality:ci`. A PR that edits a source file but forgets to regenerate `AGENTS.md` will fail CI with a clear message. See [ADR-045](/adr/045-cross-tool-agents-spine/) for the full rationale.

## Tool support matrix (2026)

| Tool | Reads | Setup |
|---|---|---|
| Cursor | `AGENTS.md` natively | None — works out of the box |
| Codex CLI | `AGENTS.md` natively | None |
| GitHub Copilot | `AGENTS.md` natively | None |
| Windsurf | `AGENTS.md` natively | None |
| Aider | `AGENTS.md` natively | None |
| Devin | `AGENTS.md` natively | None |
| Zed | `AGENTS.md` natively | None |
| Continue | `AGENTS.md` natively | None |
| Amp | `AGENTS.md` natively | None |
| Amazon Q Developer | `AGENTS.md` natively | None |
| Claude Code | `CLAUDE.md` + layered `.claude/*.md` | None — Claude reads the layered files directly; `AGENTS.md` is the cross-tool mirror |
| Gemini CLI | `GEMINI.md` (does not read `AGENTS.md`) | Not currently shipped; add a `GEMINI.md` generation target if needed |

The first eight rows are the tools the generator's banner names as native `AGENTS.md` readers; Amp and Amazon Q Developer are listed in the README and CONTRIBUTING guide.

For tools not listed: if the tool reads `AGENTS.md` natively, no setup is needed. If it requires its own file, add a thin overlay that points to `AGENTS.md` (a one-paragraph "read `AGENTS.md` first; this file adds only tool-specific directives" pointer — never a copy) and — if you want CI to keep that overlay in sync — extend [`scripts/src/build-agents-md.ts`](https://github.com/clownware/astro-performance-starter/blob/master/scripts/src/build-agents-md.ts) with an additional generation target.

## Adding a new AI tool to your project

1. Check whether the tool reads `AGENTS.md` natively (most do — see matrix above)
2. If yes: clone the repo, open it in the tool, done
3. If no: create a thin overlay file — a pointer to `AGENTS.md` plus any genuinely tool-specific directives — and document the new tool in this file's matrix

**Never copy `AGENTS.md` content into a tool-specific file** (no `cp AGENTS.md <tool-file>`). That was the pre-2026 pattern; it produces drift, which is the exact problem this architecture solves.

## Customizing for your project

When you fork this template, the constitution is yours to evolve. To change a rule:

1. Identify which source layer owns it (constitution vs engineering vs workflow vs stack)
2. Edit the source file
3. Run `pnpm agents:build`
4. Commit both the source change and the regenerated `AGENTS.md`

Keep `CLAUDE.md` to halt-on-violation rules ([ADR-036](/adr/036-layered-constitution/) holds it under 30 lines). Engineering defaults go in `.claude/engineering.md`, process in `.claude/workflow.md`, and facts in `.claude/stack.md` — a rule in the wrong layer reads with the wrong force.

For project-specific context that doesn't fit the layered constitution (target audience, business goals, brand guidelines), the right home is a PRD, not the AI rules layer — start from the [Website PRD Template](/ai-context/website-prd-template/) and follow [Creating a Website PRD](/ai-context/prd-creation-guide/). The constitution covers _how to build_; the PRD covers _what to build_.

## Validating that rules are applied

After cloning, sanity-check that AI tools are reading the rules:

```text
Test prompt: "What is this project's package manager and what are the JS/CSS budgets?"
```

The response should name pnpm (with the major version pinned in `.claude/stack.md`), JS < 160KB raw, CSS < 50KB — verbatim from the Stack section in `AGENTS.md`. If the tool answers from training data (npm, generic budgets), it isn't reading the context file. Check that the tool is configured to read `AGENTS.md` and that the file exists at the repo root.

```text
Test prompt: "Can I use client:load on a new island?"
```

The response should cite ADR-001 and the halt-on-violation rule from the Constitution section. If it doesn't, the layered constitution isn't reaching the tool.

## Troubleshooting

- **Rules not applied** — Verify `AGENTS.md` exists at the repo root (`ls AGENTS.md`); restart the AI tool to reload context; test with an explicit reference ("Per AGENTS.md, ...")
- **CI failing on `agents:check`** — Run `pnpm agents:build` locally and commit the regenerated `AGENTS.md`. This means a source file was edited without regeneration
- **Conflicting guidance between tools** — Should not happen with the cross-tool spine. If it does, a tool-specific overlay file has accumulated shared content; remove the shared content and put it in the appropriate source layer
- **Tool ignores `AGENTS.md`** — Check the tool's documentation; some tools support it behind a flag. If the tool doesn't support `AGENTS.md` at all, add a tool-specific overlay or generation target

## Related ADRs

- [ADR-034: Dual-purpose docs strategy](/adr/034-dual-purpose-docs-strategy/) — why this file serves both Starlight readers and AI filesystem context
- [ADR-036: Layered constitution](/adr/036-layered-constitution/) — why the source files split the way they do
- [ADR-045: Cross-tool agents spine](/adr/045-cross-tool-agents-spine/) — why `AGENTS.md` is generated and CI-enforced
