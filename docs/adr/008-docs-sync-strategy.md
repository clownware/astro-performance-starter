---
title: 'ADR-008: Documentation Sync Strategy'
description: >-
  Automated documentation sync from the template repository to a Starlight-based
  documentation site using GitHub Actions with PR-based review workflow
lastUpdated: 2025-09-30T00:00:00.000Z
tableOfContents: true
pagefind: true
---
## Status

Superseded by [ADR-059: Docs Drift Gate Replaces Push-Sync](./059-docs-drift-gate.md)

## Context

The Astro Performance Starter Template maintains comprehensive documentation in the `docs/` folder covering architecture decisions, implementation guides, development workflows, and usage patterns. This documentation serves multiple purposes:

1. **Developer Reference**: Guides contributors and users of the template
2. **AI Context**: Provides structured information for AI-assisted development
3. **Public Documentation**: Should be accessible via a dedicated documentation site

To make this documentation publicly accessible and searchable, we need to publish it to a separate Starlight-based documentation site. However, maintaining documentation in two places manually is error-prone and creates synchronization challenges.

### Requirements

- Documentation changes in the template repo must propagate to the Starlight docs repo
- The template repo remains the single source of truth for documentation
- Changes should be reviewable before going live in the Starlight site
- The sync process should be automated to minimize manual intervention
- The solution should handle file additions, modifications, and deletions

## Decision Drivers

- **Single Source of Truth**: Documentation must live in one place to prevent drift
- **Automation**: Manual syncing does not scale and is error-prone
- **Review Workflow**: Changes should be reviewable before going live
- **Structural Flexibility**: Template and Starlight repos may have different directory structures
- **Security**: Authentication must follow least-privilege principles

## Considered Options

### Option 1: Git Submodules

**Description**: Link the docs directory as a Git submodule in the Starlight repo

**Pros**:

- Native Git feature, no external tooling

**Cons**:

- Couples repositories tightly
- Doesn't support different structures between template and Starlight

### Option 2: Git Subtree

**Description**: Mirror docs directory using Git subtree pushes

**Pros**:

- Better for mirroring than submodules
- No special tooling needed for consumers

**Cons**:

- Requires manual pushes
- Lacks automated review workflow

### Option 3: Manual Copy/Paste

**Description**: Manually copy documentation between repositories

**Pros**:

- No setup required

**Cons**:

- Error-prone, time-consuming, doesn't scale with multiple contributors

### Option 4: Monorepo

**Description**: Combine both projects into a single repository

**Pros**:

- Single repository simplifies management

**Cons**:

- Would require significant restructuring
- Doesn't align with separate hosting preferences

### Option 5: GitHub Actions with Automated PR

**Description**: Automated workflow that syncs docs and opens PRs in the Starlight repo

**Pros**:

- Full automation with minimal manual intervention
- Maintains review workflow via PRs
- Allows structural differences between repos
- Clear audit trail

**Cons**:

- Requires PAT management and periodic rotation
- GitHub Actions quota consumption
- PR review adds latency before docs go live

## Decision

We will implement an automated documentation sync using GitHub Actions that:

1. **Triggers on Documentation Changes**: Workflow runs only when files in `docs/**` are modified and pushed to `master` or `main` branches
2. **Creates Pull Requests**: Automatically opens PRs in the Starlight docs repo rather than direct pushes
3. **Maintains Traceability**: Each sync PR includes references to source commits and review checklists
4. **Allows Review**: PRs enable review of changes before they go live, allowing for Starlight-specific adjustments

### Implementation Details

- **Workflow File**: `.github/workflows/sync-docs-to-starlight.yml`
- **Authentication**: Uses GitHub Personal Access Token (PAT) stored as repository secret `STARLIGHT_REPO_PAT`
- **Sync Method**: Full directory copy using `rsync` to handle additions, modifications, and deletions
- **Branch Strategy**: Creates timestamped branches (`sync-docs-YYYYMMDD-HHMMSS`) for each sync
- **PR Content**: Includes source commit reference, review checklist, and automated workflow attribution

### Workflow Sequence

```
Template Repo (docs/ changes) 
  → Push to main/master
  → GitHub Actions detects docs/** changes
  → Clone Starlight repo
  → Sync docs/ → Starlight repo root
  → Commit changes
  → Create timestamped branch
  → Open PR with context
  → Manual review in Starlight repo
  → Merge → Starlight deployment
```

## Consequences

### Positive

- **Automation**: Eliminates manual copying and reduces human error
- **Review Workflow**: PRs allow verification before changes go live
- **Traceability**: Clear audit trail linking template changes to docs updates
- **Flexibility**: Allows Starlight-specific modifications during PR review
- **Scalability**: Handles multiple contributors without coordination overhead
- **Single Source of Truth**: Template repo remains authoritative for documentation

### Negative

- **Token Management**: Requires PAT creation and periodic rotation (security overhead)
- **Merge Conflicts**: Can occur if changes are made directly in Starlight repo
- **Latency**: Documentation updates require PR review before going live (not instant)
- **GitHub Actions Quota**: Consumes Actions minutes (minimal impact for docs-only changes)

### Neutral

- Token security requires minimum scopes (`repo`, `workflow`) and 90-day rotation
- Template repo must be established as single source of truth to prevent conflicts
- Automated PR includes review checklist and source references to streamline review

## Scope

This strategy applies to:

- All files within the `docs/` directory of the template repository
- Synchronization to the configured Starlight documentation repository
- Changes pushed to `master` or `main` branches only

This does NOT apply to:

- Source code files outside `docs/`
- Draft branches or feature branches
- README.md or other root-level documentation files (unless explicitly added to workflow)

## Validation

- **Sync Success Rate**: All docs changes on main/master trigger a sync PR within 5 minutes
- **PR Quality**: Sync PRs include source commit reference and review checklist
- **No Manual Drift**: Zero documentation-only edits made directly in the Starlight repo

## References

- Documentation Sync Setup Guide (`docs/development/docs-sync-setup.md`) — removed with the push-sync retirement ([ADR-059](./059-docs-drift-gate.md))
- GitHub Actions Workflow (`.github/workflows/sync-docs-to-starlight.yml`) — removed with the push-sync retirement ([ADR-059](./059-docs-drift-gate.md))
- Starlight Documentation Repository (configured via `STARLIGHT_REPO` secret)

## Notes

Future considerations:

1. **Bidirectional Sync**: If Starlight-specific changes become common, consider reverse sync workflow
2. **Path Mapping**: If Starlight requires different directory structure, add transformation step
3. **Frontmatter Processing**: If Starlight needs specific frontmatter fields, add preprocessing
4. **GitHub App**: For production at scale, consider GitHub App instead of PAT for better security
5. **Notification Integration**: Add Slack/Discord webhooks for sync PR notifications

---
**Date**: 2025-09-30\
**Participants**: Template maintainers\
**Outcome**: Superseded by ADR-059
