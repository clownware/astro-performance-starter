# Documentation Sync Quick Start

This repository automatically syncs documentation changes to a separate Starlight docs repository (configured via the `STARLIGHT_REPO` secret).

## 🚀 Quick Setup (5 minutes)

### 1. Create GitHub Personal Access Token

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Set name: `Astro Starter Docs Sync`
4. Select scopes: `repo` and `workflow`
5. Generate and **copy the token**

### 2. Add Token to Repository

1. Go to this repo's **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name: `STARLIGHT_REPO_PAT`
4. Value: Paste your token
5. Click **Add secret**

### 3. Test It

```bash
# Make a test change
echo "Test sync" >> docs/README.md

# Commit and push
git add docs/README.md
git commit -m "docs: test sync workflow"
git push origin main
```

Check the **Actions** tab to see the workflow run. A PR should appear in your configured Starlight docs repo.

## 📋 How It Works

- **Trigger**: Pushes to `main`/`master` that modify `docs/**`
- **Action**: Copies entire `docs/` folder to Starlight repo
- **Output**: Creates a PR with source commit reference
- **Review**: Merge the PR in Starlight repo to publish

## 📚 Full Documentation

- **Setup Guide**: [docs/development/docs-sync-setup.md](docs/development/docs-sync-setup.md)
- **Architecture Decision**: [docs/adr/008-docs-sync-strategy.md](docs/adr/008-docs-sync-strategy.md)
- **Workflow File**: [.github/workflows/sync-docs-to-starlight.yml](.github/workflows/sync-docs-to-starlight.yml)

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Workflow fails with auth error | Verify `STARLIGHT_REPO_PAT` secret exists and hasn't expired |
| No PR created | Check workflow logs in Actions tab; ensure changes were in `docs/` |
| Merge conflicts | Avoid editing docs directly in Starlight repo; use template repo |

## 🔒 Security Notes

- Token has `repo` and `workflow` scopes only
- Stored as encrypted repository secret
- Rotate token every 90 days
- Never commit the token to the repository
