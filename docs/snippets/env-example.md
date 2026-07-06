---
title: .env.example
description: '```bash'
lastUpdated: true
tableOfContents: true
pagefind: true
---
```bash
# .env.example
# Copy this file to .env and fill in your values. DO NOT commit .env.

# Site Configuration
#
# SITE_URL (required for production builds) — canonical origin, no trailing slash.
# The build fails if it is unset or contains placeholder values.
# SITE_URL=https://your-username.github.io
#
# Alternatively use PUBLIC_SITE_URL (exposed to client-side code via Astro):
PUBLIC_SITE_URL=http://localhost:4321

# Deployment Target
# Set to "gh-pages" for GitHub Pages (derives base path from package.json "name").
# Leave unset for root deployments (Cloudflare Pages, Netlify, Vercel, etc.)
# DEPLOY_TARGET=gh-pages

# Analytics (optional) — not yet implemented; uncomment when adding support.
# PUBLIC_PLAUSIBLE_DOMAIN="your-domain.com"
# PUBLIC_FATHOM_SITE_ID="YOUR_FATHOM_SITE_ID"

# Contact Information
PUBLIC_CONTACT_EMAIL=hello@example.com
PUBLIC_CONTACT_PHONE=+1234567890
PUBLIC_CONTACT_PHONE_DISPLAY="+1 (234) 567-890"
PUBLIC_CONTACT_LOCATION="San Francisco, CA"
PUBLIC_CONTACT_TIMEZONE="Mon-Fri, 9AM-6PM PST"

# Social Media Links
PUBLIC_SOCIAL_GITHUB=https://github.com/example
PUBLIC_SOCIAL_LINKEDIN=https://linkedin.com/company/example
PUBLIC_SOCIAL_TWITTER=https://twitter.com/example

```
