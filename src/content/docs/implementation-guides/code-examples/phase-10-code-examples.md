---
title: Phase 10 - Code Examples  
lastUpdated: true
description: >-
  Code examples for Phase 10
tableOfContents: true
pagefind: true
---

## Deployment Platforms

### 1. Cloudflare Pages (Recommended)

Cloudflare Pages is the recommended deployment platform for this project due to its fast global edge network, free analytics, and seamless integration with Cloudflare Workers for any dynamic functionalities or server-side rendering (SSR) needs. This makes it an excellent choice for high-performance static sites with the option to scale to more complex applications.

**Key Advantages**:

- **Performance**: Leverages Cloudflare's extensive CDN for fast content delivery worldwide.
- **Analytics**: Provides built-in, privacy-focused web analytics.
- **Scalability with Workers**: Easily add server-side logic, API endpoints, or SSR for specific components/pages using Cloudflare Workers.

**Watch-outs & Tweaks**:

- **SSR Islands & Cloudflare Functions**: If using SSR for Astro {{versions.astro}} islands or implementing API routes via Cloudflare Functions (either through Pages Functions or dedicated Workers), be mindful of potential cold starts. These can impact the initial response time for dynamic parts of your site.
- **Performance Budgeting**: Factor in potential cold start times into your performance targets, especially for critical user interactions relying on server-side execution. Optimize functions for quick boot-up where possible.
- **Configuration**: Ensure `wrangler.toml` is correctly configured for your project's needs, including environment variables, redirects, and custom headers.

```yaml
# .github/workflows/deploy-cloudflare.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build site
        run: pnpm run build
        env:
          NODE_ENV: production
          
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: your-project-name
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
          deploymentName: ${{ github.event.pull_request.head.ref || github.ref_name }}
```

```toml
# wrangler.toml - Cloudflare configuration
name = "your-project-name"
compatibility_date = "2024-01-15"

[site]
bucket = "./dist"

[env.production]
vars = { ENVIRONMENT = "production" }

[env.preview]
vars = { ENVIRONMENT = "preview" }

# Redirects
[[redirects]]
from = "/old-path"
to = "/new-path"
status = 301

# Headers
[[headers]]
for = "/*"
[headers.values]
X-Frame-Options = "DENY"
X-Content-Type-Options = "nosniff"
Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
for = "/_astro/*"
[headers.values]
Cache-Control = "public, max-age=31536000, immutable"
```

### 2. Vercel Alternative

```json
// vercel.json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "framework": "astro",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    },
    {
      "source": "/_astro/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "functions": {
    "api/*.ts": {
      "maxDuration": 10
    }
  }
}
```

### 3. Netlify Alternative

```toml
# netlify.toml
[build]
  command = "pnpm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"

[[redirects]]
  from = "/old-path"
  to = "/new-path"
  status = 301

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Edge Functions
[[edge_functions]]
  path = "/api/*"
  function = "api"

# Deploy contexts
[context.production]
  environment = { NODE_ENV = "production" }

[context.deploy-preview]
  environment = { NODE_ENV = "preview" }

[context.branch-deploy]
  environment = { NODE_ENV = "development" }
```

## Environment Configuration

### 1. Environment Variables

```bash
# .env.example
# Site Configuration
PUBLIC_SITE_URL=https://yourdomain.com
PUBLIC_SITE_NAME="Your Site Name"

# Analytics (Public keys only)
PUBLIC_ANALYTICS_ID=your-analytics-id
PUBLIC_GTM_ID=GTM-XXXXXX

# API Keys (Server-side only)
CONTACT_FORM_API_KEY=your-api-key
EMAIL_SERVICE_KEY=your-email-key

# Build Configuration
NODE_ENV=production
SKIP_PREFLIGHT_CHECK=true

# Feature Flags
PUBLIC_ENABLE_ANALYTICS=true
PUBLIC_ENABLE_NEWSLETTER=false
```

```typescript
// src/config/env.ts
// Type-safe environment variables
const env = {
  // Public variables (available in browser)
  public: {
    siteUrl: import.meta.env.PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: import.meta.env.PUBLIC_SITE_NAME || 'Default Site Name',
    analyticsId: import.meta.env.PUBLIC_ANALYTICS_ID,
    gtmId: import.meta.env.PUBLIC_GTM_ID,
    enableAnalytics: import.meta.env.PUBLIC_ENABLE_ANALYTICS === 'true',
    enableNewsletter: import.meta.env.PUBLIC_ENABLE_NEWSLETTER === 'true',
  },
  
  // Server-only variables
  server: {
    contactFormApiKey: import.meta.env.CONTACT_FORM_API_KEY,
    emailServiceKey: import.meta.env.EMAIL_SERVICE_KEY,
    nodeEnv: import.meta.env.NODE_ENV || 'development',
  },
  
  // Computed values
  isProd: import.meta.env.NODE_ENV === 'production',
  isDev: import.meta.env.NODE_ENV === 'development',
  isPreview: import.meta.env.NODE_ENV === 'preview',
};

// Validate required variables
if (env.isProd) {
  const required = ['PUBLIC_SITE_URL', 'PUBLIC_SITE_NAME'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export default env;
```

### 2. Build Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV, process.cwd(), '');

export default defineConfig({
  site: PUBLIC_SITE_URL || 'https://localhost:3000',
  
  build: {
    // Generate sitemap with correct URL
    sitemap: true,
    
    // Asset naming for cache busting
    assets: '_astro',
    
    // Inline styles threshold
    inlineStylesheets: 'auto',
  },
  
  // Server configuration for preview
  server: {
    port: 3000,
    host: true,
  },
  
  // Deployment adapter (if using SSR)
  output: 'static', // or 'server' for SSR
  
  // Vite configuration
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom'],
            'utils': ['date-fns', 'lodash-es'],
          },
        },
      },
    },
  },
});
```

## Monitoring Setup

### 1. Uptime Monitoring

```typescript
// api/health.ts - Health check endpoint
export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    checks: {
      database: await checkDatabase(),
      cache: await checkCache(),
      storage: await checkStorage(),
    },
  };
  
  const isHealthy = Object.values(checks.checks).every(check => check.status === 'ok');
  
  return new Response(JSON.stringify(checks), {
    status: isHealthy ? 200 : 503,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
}

async function checkDatabase() {
  try {
    // Your database check logic
    return { status: 'ok', latency: 10 };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

async function checkCache() {
  try {
    // Your cache check logic
    return { status: 'ok', latency: 5 };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

async function checkStorage() {
  try {
    // Your storage check logic
    return { status: 'ok', available: '10GB' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}
```

### 2. Error Tracking (Showcase)

```typescript
// src/lib/error-tracking.ts
import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';

// Initialize Sentry
if (import.meta.env.PUBLIC_SENTRY_DSN && import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.PUBLIC_SENTRY_DSN,
    environment: import.meta.env.PUBLIC_ENVIRONMENT || 'production',
    integrations: [
      new BrowserTracing(),
    ],
    tracesSampleRate: 0.1, // 10% of transactions
    
    // Filter out known issues
    beforeSend(event, hint) {
      // Ignore specific errors
      if (event.exception?.values?.[0]?.type === 'NetworkError') {
        return null;
      }
      
      // Remove sensitive data
      if (event.request?.cookies) {
        delete event.request.cookies;
      }
      
      return event;
    },
  });
}

// Error boundary component
export function captureError(error: Error, context?: Record<string, any>) {
  console.error('Application error:', error);
  
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      contexts: {
        custom: context,
      },
    });
  }
}

// Performance monitoring
export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  const transaction = Sentry.startTransaction({ name });
  
  try {
    const result = fn();
    if (result instanceof Promise) {
      return result.finally(() => transaction.finish());
    }
    transaction.finish();
    return result;
  } catch (error) {
    transaction.setStatus('internal_error');
    transaction.finish();
    throw error;
  }
}
```

### 3. Analytics Setup

```astro


***


// src/components/Analytics.astro
const { analyticsId, gtmId, enableAnalytics } = Astro.props;


***



{enableAnalytics && (
  <>
    <!-- Google Tag Manager -->
    {gtmId && (
      <>
        <script is:inline>
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','{gtmId}');
        </script>
        <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0" 
            width="0" 
            style="display:none;visibility:hidden"
          ></iframe>
        </noscript>
      </>
    )}
    
    <!-- Plausible Analytics (Privacy-focused alternative) -->
    {analyticsId && !gtmId && (
      <script 
        defer 
        data-domain={analyticsId} 
        src="https://plausible.io/js/script.js"
      ></script>
    )}
    
    <!-- Custom analytics events -->
    <script>
      // Track Core Web Vitals
      import { getCLS, getFID, getLCP } from 'web-vitals';
      
      function sendToAnalytics(metric) {
        // Google Analytics
        if (window.gtag) {
          gtag('event', metric.name, {
            value: Math.round(metric.value),
            metric_id: metric.id,
            metric_value: metric.value,
            metric_delta: metric.delta,
          });
        }
        
        // Plausible
        if (window.plausible) {
          plausible('Web Vitals', {
            props: {
              metric: metric.name,
              value: Math.round(metric.value),
            },
          });
        }
      }
      
      getCLS(sendToAnalytics);
      getFID(sendToAnalytics);
      getLCP(sendToAnalytics);
    </script>
  </>
)}
```

### 4. Performance Monitoring (Showcase)

```typescript
// src/lib/rum.ts - Real User Monitoring
class RUM {
  private metrics: Record<string, any> = {};
  private observer: PerformanceObserver | null = null;
  
  constructor(private endpoint: string) {
    this.initializeObservers();
  }
  
  private initializeObservers() {
    // Navigation timing
    if ('performance' in window && 'PerformanceObserver' in window) {
      // Observe long tasks
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            this.track('long-task', {
              duration: entry.duration,
              startTime: entry.startTime,
            });
          }
        }
      });
      
      this.observer.observe({ entryTypes: ['longtask'] });
      
      // Track navigation timing
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        this.track('navigation', {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          domInteractive: navigation.domInteractive - navigation.fetchStart,
          ttfb: navigation.responseStart - navigation.requestStart,
        });
      });
    }
  }
  
  track(eventName: string, data: Record<string, any>) {
    const event = {
      event: eventName,
      data,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: (navigator as any).connection?.effectiveType,
    };
    
    // Batch events
    this.metrics[eventName] = this.metrics[eventName] || [];
    this.metrics[eventName].push(event);
    
    // Send in batches
    if (this.metrics[eventName].length >= 10) {
      this.flush(eventName);
    }
  }
  
  private flush(eventName?: string) {
    const eventsToSend = eventName 
      ? { [eventName]: this.metrics[eventName] }
      : this.metrics;
    
    if (Object.keys(eventsToSend).length === 0) return;
    
    navigator.sendBeacon(this.endpoint, JSON.stringify(eventsToSend));
    
    // Clear sent events
    if (eventName) {
      this.metrics[eventName] = [];
    } else {
      this.metrics = {};
    }
  }
  
  destroy() {
    // Flush remaining events
    this.flush();
    
    // Clean up observer
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Initialize RUM
export const rum = new RUM('/api/rum');

// Ensure events are sent before page unload
window.addEventListener('beforeunload', () => {
  rum.destroy();
});
```

## Backup & Recovery

### 1. Automated Backups

```yaml
# .github/workflows/backup.yml
name: Automated Backup

on:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Get full history
          
      - name: Create backup archive
        run: |
          BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
          tar -czf "${BACKUP_NAME}.tar.gz" \
            --exclude=node_modules \
            --exclude=.git \
            --exclude=dist \
            .
            
      - name: Upload to backup storage
        uses: actions/upload-artifact@v4
        with:
          name: site-backup-${{ github.run_id }}
          path: backup-*.tar.gz
          retention-days: 30
          
      # Optional: Upload to external storage
      - name: Upload to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws s3 cp backup-*.tar.gz s3://your-backup-bucket/backups/
```

### 2. Database Backup (If Applicable)

```typescript
// scripts/backup-content.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createGzip } from 'zlib';

const execAsync = promisify(exec);

async function backupContent() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = `backups/${timestamp}`;
  
  // Create backup directory
  await execAsync(`mkdir -p ${backupDir}`);
  
  // Backup content files
  await execAsync(`cp -r src/content ${backupDir}/`);
  
  // Backup images
  await execAsync(`cp -r public/images ${backupDir}/`);
  
  // Backup configuration
  await execAsync(`cp -r *.config.* ${backupDir}/`);
  
  // Create compressed archive
  const tarFile = `backup-${timestamp}.tar.gz`;
  await execAsync(`tar -czf ${tarFile} ${backupDir}`);
  
  // Upload to cloud storage
  if (process.env.BACKUP_BUCKET) {
    console.log('Uploading to cloud storage...');
    // Your cloud storage upload logic
  }
  
  // Clean up old backups (keep last 7)
  const { stdout } = await execAsync('ls -1 backup-*.tar.gz | sort -r | tail -n +8');
  const oldBackups = stdout.trim().split('\n').filter(Boolean);
  
  for (const backup of oldBackups) {
    await execAsync(`rm ${backup}`);
  }
  
  console.log(`✅ Backup created: ${tarFile}`);
}

backupContent().catch(console.error);
```
