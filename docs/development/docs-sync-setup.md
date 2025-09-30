# Documentation Sync Setup Guide

This guide explains how to set up the automated documentation synchronization between the Astro Starter Template repository and the Starlight documentation repository.

## Overview

The template repository uses a GitHub Actions workflow to automatically detect changes in the `docs/` folder and create pull requests in the [astro-starter-docs](https://github.com/clownware/astro-starter-docs) repository.

## Prerequisites

- Admin access to both repositories (template and Starlight docs)
- Ability to create GitHub Personal Access Tokens (PAT)

## Setup Instructions

### 1. Create a GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → [Tokens (classic)](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Configure the token:
   - **Note**: `Astro Starter Docs Sync`
   - **Expiration**: Choose appropriate duration (recommend 90 days or 1 year)
   - **Scopes**: Select the following:
     - `repo` (Full control of private repositories)
     - `workflow` (Update GitHub Action workflows)
4. Click **Generate token**
5. **Important**: Copy the token immediately (you won't see it again)

### 2. Add Token as Repository Secret

1. Navigate to the **template repository** (astro-starter-template)
2. Go to Settings → Secrets and variables → Actions
3. Click **New repository secret**
4. Configure the secret:
   - **Name**: `STARLIGHT_REPO_PAT`
   - **Secret**: Paste the PAT you created in step 1
5. Click **Add secret**

### 3. Verify Workflow Configuration

The workflow file is located at `.github/workflows/sync-docs-to-starlight.yml` and is configured to:

- **Trigger**: On push to `master` or `main` branches
- **Path filter**: Only when files in `docs/**` change
- **Target repo**: `clownware/astro-starter-docs`
- **Target branch**: `main`

### 4. Test the Workflow

1. Make a test change to any file in the `docs/` folder
2. Commit and push to the `main` or `master` branch:

   ```bash
   git add docs/
   git commit -m "docs: test sync workflow"
   git push origin main
   ```

3. Check the Actions tab in the template repository to see the workflow run
4. If successful, a new PR should appear in the Starlight docs repository

## Workflow Behavior

### What Happens on Each Push

1. **Detection**: Workflow triggers only when `docs/**` files change
2. **Clone**: Clones the Starlight docs repository
3. **Sync**: Copies all files from `docs/` to the Starlight repo root
4. **Commit**: Creates a commit with reference to the source commit
5. **PR Creation**: Opens a pull request with:
   - Descriptive title and body
   - Link to source commit
   - Review checklist
   - Unique branch name with timestamp

### PR Review Process

When a sync PR is created in the Starlight repo:

1. **Review the changes**: Check the Files changed tab
2. **Verify structure**: Ensure paths work with Starlight's expected structure
3. **Check frontmatter**: Starlight may require specific frontmatter fields
4. **Test locally**: Clone and preview the Starlight site with changes
5. **Merge**: If everything looks good, merge the PR

## Troubleshooting

### Workflow Fails with Authentication Error

**Symptom**: Error message about authentication or permission denied

**Solutions**:

- Verify the `STARLIGHT_REPO_PAT` secret exists and is correctly named
- Check that the PAT hasn't expired
- Ensure the PAT has `repo` and `workflow` scopes
- Regenerate the PAT if needed and update the secret

### No PR Created Despite Changes

**Symptom**: Workflow runs but no PR appears in Starlight repo

**Solutions**:

- Check the workflow logs in the Actions tab
- Verify changes were actually in the `docs/` folder
- Ensure the target repository URL is correct
- Check if a PR already exists for the same changes

### Merge Conflicts in Starlight Repo

**Symptom**: PR shows merge conflicts

**Solutions**:

- This indicates manual changes were made in the Starlight repo
- Decide which changes to keep (template or Starlight)
- Resolve conflicts manually in the PR
- Consider making all doc changes in the template repo to avoid this

## Maintenance

### Token Expiration

- Set a calendar reminder before your PAT expires
- Regenerate the token and update the repository secret
- No code changes needed, just update the secret value

### Workflow Updates

If you need to modify the sync behavior:

1. Edit `.github/workflows/sync-docs-to-starlight.yml`
2. Test changes on a feature branch first
3. Document changes in the workflow's commit message

## Security Considerations

- **PAT Storage**: Never commit the PAT to the repository
- **Scope Limitation**: Use the minimum required scopes (repo, workflow)
- **Token Rotation**: Rotate tokens periodically (every 90 days recommended)
- **Access Review**: Regularly review who has access to repository secrets

## Related Documentation

- [ADR: Documentation Sync Strategy](../adr/008-docs-sync-strategy.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Starlight Documentation](https://starlight.astro.build/)
