---
title: 'ADR 008: Documentation Sync Strategy'
description: "**Status**: Accepted\r **Date**: 2025-09-30"
lastUpdated: true
tableOfContents: true
pagefind: true
---
# ADR 008: Documentation Sync Strategy

**Status**: Accepted  
**Date**: 2025-09-30

## Context

The Astro Performance Starter Template maintains comprehensive documentation in the `docs/` folder covering architecture decisions, implementation guides, development workflows, and usage patterns. This documentation serves multiple purposes:

1. **Developer Reference**: Guides contributors and users of the template
2. **AI Context**: Provides structured information for AI-assisted development
3. **Public Documentation**: Should be accessible via a dedicated documentation site

To make this documentation publicly accessible and searchable, we need to publish it to a separate Starlight-based documentation site at [github.com/clownware/astro-starter-docs](https://github.com/clownware/astro-starter-docs). However, maintaining documentation in two places manually is error-prone and creates synchronization challenges.

### Requirements

- Documentation changes in the template repo must propagate to the Starlight docs repo
- The template repo remains the single source of truth for documentation
- Changes should be reviewable before going live in the Starlight site
- The sync process should be automated to minimize manual intervention
- The solution should handle file additions, modifications, and deletions

### Alternatives Considered

1. **Git Submodules**: Couples repositories tightly; doesn't support different structures between template and Starlight
2. **Git Subtree**: Better for mirroring but requires manual pushes; lacks automated review workflow
3. **Manual Copy/Paste**: Error-prone, time-consuming, doesn't scale with multiple contributors
4. **Monorepo**: Would require significant restructuring; doesn't align with separate hosting preferences
5. **GitHub Actions with Automated PR**: Provides automation, maintains review workflow, allows structural differences

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

### Benefits

- **Automation**: Eliminates manual copying and reduces human error
- **Review Workflow**: PRs allow verification before changes go live
- **Traceability**: Clear audit trail linking template changes to docs updates
- **Flexibility**: Allows Starlight-specific modifications during PR review
- **Scalability**: Handles multiple contributors without coordination overhead
- **Single Source of Truth**: Template repo remains authoritative for documentation

### Potential Downsides

- **Token Management**: Requires PAT creation and periodic rotation (security overhead)
- **Merge Conflicts**: Can occur if changes are made directly in Starlight repo
- **Latency**: Documentation updates require PR review before going live (not instant)
- **GitHub Actions Quota**: Consumes Actions minutes (minimal impact for docs-only changes)

### Mitigation Strategies

1. **Token Security**:
   - Use minimum required scopes (`repo`, `workflow`)
   - Rotate tokens every 90 days
   - Store only as encrypted repository secret
   - Document token management in setup guide

2. **Conflict Prevention**:
   - Establish template repo as single source of truth
   - Discourage direct edits in Starlight repo
   - Document proper workflow in both repositories

3. **Review Efficiency**:
   - Automated PR includes review checklist
   - Clear commit messages with source references
   - Batch related documentation changes when possible

4. **Monitoring**:
   - GitHub Actions provides workflow run history
   - Failed workflows trigger notifications
   - Regular review of sync PR patterns

## Scope

This strategy applies to:

- All files within the `docs/` directory of the template repository
- Synchronization to the `clownware/astro-starter-docs` repository
- Changes pushed to `master` or `main` branches only

This does NOT apply to:

- Source code files outside `docs/`
- Draft branches or feature branches
- README.md or other root-level documentation files (unless explicitly added to workflow)

## Related Documentation

- [Documentation Sync Setup Guide](../development/docs-sync-setup.md)
- [GitHub Actions Workflow](.github/workflows/sync-docs-to-starlight.yml)
- [Starlight Documentation Repository](https://github.com/clownware/astro-starter-docs)

## Future Considerations

1. **Bidirectional Sync**: If Starlight-specific changes become common, consider reverse sync workflow
2. **Path Mapping**: If Starlight requires different directory structure, add transformation step
3. **Frontmatter Processing**: If Starlight needs specific frontmatter fields, add preprocessing
4. **GitHub App**: For production at scale, consider GitHub App instead of PAT for better security
5. **Notification Integration**: Add Slack/Discord webhooks for sync PR notifications
