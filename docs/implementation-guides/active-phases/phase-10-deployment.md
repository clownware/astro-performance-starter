---
title: Phase 10 - Deployment & Monitoring
lastUpdated: true
description: >-
  Covers live site deployment, CI/CD pipeline, monitoring setup, and backup
  strategy with Essential, Recommended, and Advanced scope guidance
tableOfContents: true
pagefind: true
sidebar:
  order: 10
---
## Overview

- **Tier**: Polish (Phase 10 of 12)
- **Duration**: 1 day
- **Dependencies**: Phase 0-9 completed
- **Deliverables**: Live site, CI/CD pipeline, monitoring setup, backup strategy

## Entry Criteria

- [ ] Performance optimization complete
- [ ] All tests passing
- [ ] Content finalized
- [ ] Domain and hosting ready

## Implementation Steps

| Step | Task | Scope | Notes |
|------|------|-------|-------|
| 10.01 | Choose hosting platform | Essential | GitHub Pages ships preconfigured; Cloudflare Pages, Netlify, Vercel are alternatives |
| 10.02 | Configure build settings | Essential | Environment variables |
| 10.03 | Set up CI/CD pipeline | Essential | Auto-deploy on push |
| 10.04 | Configure custom domain | Essential | DNS settings |
| 10.05 | SSL certificate setup | Essential | Auto-provisioned |
| 10.06 | Deploy to staging | Essential | Preview environment (on GitHub Pages, PR checks — build, tests, Lighthouse — stand in for staging) |
| 10.07 | Production deployment | Essential | Go live |
| 10.08 | Set up monitoring | Essential | Uptime, basic metrics |
| 10.09 | Configure backups | Essential | Code and content |
| 10.10 | Error tracking | Advanced | Sentry or similar |
| 10.11 | Analytics setup | Recommended | Privacy-focused |
| 10.12 | Performance monitoring | Advanced | RUM, dashboards |

> **Note**: The starter ships a GitHub Pages workflow out of the box (`.github/workflows/deploy.yml`); Cloudflare Pages is an alternative deployment path. If you deploy to Cloudflare Pages from CI, use `cloudflare/wrangler-action@v3` with `command: pages deploy dist --project-name=<name>` — the older `cloudflare/pages-action@v1` is deprecated. Static deploys to Cloudflare Pages need no `wrangler.toml`.

## Security Checklist

```markdown
# Production Security Checklist

## Environment
- [ ] All sensitive keys in environment variables
- [ ] Different keys for staging/production
- [ ] No secrets in code repository
- [ ] Environment variables documented

## Headers
- [ ] Security headers configured
- [ ] CSP policy implemented
- [ ] HSTS enabled
- [ ] X-Frame-Options set

## SSL/TLS
- [ ] SSL certificate active
- [ ] Auto-renewal configured
- [ ] HTTP redirects to HTTPS
- [ ] HSTS preload submitted

## Access Control
- [ ] Admin routes protected
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Authentication implemented

## Monitoring
- [ ] Error tracking active
- [ ] Security alerts configured
- [ ] Uptime monitoring enabled
- [ ] Performance tracking live

## Backups
- [ ] Automated backups running
- [ ] Backup restoration tested
- [ ] Off-site backup storage
- [ ] Backup encryption enabled
```

## Common Pitfalls

1. **Missing Environment Variables**: Forgetting to set production variables
   - **Solution**: Validate required variables on build

2. **Cache Issues**: Old content served after updates
   - **Solution**: Implement cache busting strategy

3. **SSL Problems**: Certificate errors or mixed content
   - **Solution**: Force HTTPS, update all URLs

4. **Missing Redirects**: Old URLs returning 404
   - **Solution**: Set up redirect rules on a header-capable host (Cloudflare Pages, Netlify); GitHub Pages has no redirects file, so ship meta-refresh pages instead

5. **Monitoring Blind Spots**: Not tracking critical metrics
   - **Solution**: Comprehensive monitoring setup

## Exit Criteria

### Essential (all projects)

- [ ] Site deployed to production
- [ ] Custom domain configured (`SITE_URL` set; see `.github/workflows/deploy.yml`)
- [ ] SSL certificate active
- [ ] CI/CD pipeline functional (`ci.yml`, `lighthouse.yml`, `deploy.yml` green)
- [ ] Preview deployments or PR checks working
- [ ] Uptime monitoring active
- [ ] Backups automated
- [ ] Security headers verified (`public/_headers` — honoured by Cloudflare Pages/Netlify, a no-op on GitHub Pages)
- [ ] Documentation updated

### Recommended (most projects)

- [ ] Analytics configured (privacy-focused; opt-in, not shipped)

### Advanced (portfolio/enterprise)

- [ ] Error tracking enabled (Sentry or equivalent)
- [ ] Performance monitoring live (RUM dashboards)
- [ ] Alerting configured for error rate thresholds

## Rollback Strategy

If deployment issues occur:

1. **Failed Deployment**:
   - Use previous successful build
   - Check build logs for errors
   - Verify environment variables

2. **Production Issues**:
   - Immediate rollback available
   - Use preview deployments for testing
   - Monitor error rates

3. **Performance Degradation**:
   - Check CDN configuration
   - Verify caching headers
   - Review recent changes

## AI Assistant Notes

### Key Files to Reference

- `.github/workflows/deploy.yml` - Shipped GitHub Pages deploy (resolves `SITE_URL` / `DEPLOY_TARGET`)
- `.github/workflows/ci.yml`, `lighthouse.yml` - Quality and Lighthouse gates
- `.env.example` - Environment variable setup (`pnpm run env:validate` runs before every build)
- `public/_headers` - Security and caching headers
- `astro.config.mjs` - `site` / `base` derived from `SITE_URL` and `DEPLOY_TARGET`

### Common Prompts for This Phase

- "Point the GitHub Pages deploy at a custom domain"
- "Set up Cloudflare Pages deployment as an alternative"
- "Configure GitHub Actions for CI/CD"
- "Implement error tracking with Sentry"
- "Create automated backup strategy"

### Context Requirements

- Hosting platform choice
- Domain name
- Analytics preferences
- Monitoring requirements
