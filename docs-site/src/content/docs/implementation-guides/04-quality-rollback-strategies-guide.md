---
title: Rollback Strategies - Recovery Procedures
description: "> \U0001F504 **Purpose**: Comprehensive recovery procedures for when things go wrong"
---
# Rollback Strategies - Recovery Procedures

> 🔄 **Purpose**: Comprehensive recovery procedures for when things go wrong

## Overview

This guide outlines rollback strategies for various failure scenarios during development and deployment. Each strategy includes prevention measures, detection methods, and step-by-step recovery procedures.

## Rollback Decision Matrix

| Issue Type | Severity | Rollback Speed | Data Loss Risk | Recommended Action |
|------------|----------|----------------|----------------|-------------------|
| **Build Failure** | High | Immediate | None | Revert commit |
| **Deploy Failure** | High | Immediate | None | Use previous build |
| **Performance Regression** | Medium | 1-4 hours | None | Feature flag or revert |
| **Visual Bug** | Low | Next deploy | None | Forward fix |
| **Data Corruption** | Critical | Immediate | Possible | Restore from backup |
| **Security Issue** | Critical | Immediate | None | Emergency patch |

## Phase-Specific Rollback Strategies

### Phase 0-3: Foundation Rollback

These phases involve fundamental decisions that are expensive to change.

#### Issue: Wrong Framework Version

```bash
# Detection
npm run build # Fails with compatibility errors

# Rollback Steps
1. Identify last working version
   git log --oneline package.json
   
2. Revert to working version
   git checkout <commit-hash> -- package.json pnpm-lock.yaml
   
3. Clean and reinstall
   rm -rf node_modules .astro
   pnpm install
   
4. Verify fix
   pnpm run dev

# Prevention
- Lock exact versions in package.json
- Test upgrades in feature branch
- Document version requirements
```

#### Issue: TypeScript Configuration Breaking Build

```bash
# Detection
tsc --noEmit # Shows numerous type errors

# Rollback Steps
1. Restore previous config
   git checkout HEAD~1 -- tsconfig.json
   
2. If schema issues, restore types
   git checkout HEAD~1 -- src/env.d.ts
   git checkout HEAD~1 -- src/content/config.ts
   
3. Regenerate types
   pnpm run astro sync
   
4. Gradual re-implementation
   - Enable strict mode incrementally
   - Fix types file by file

# Prevention
- Change one TypeScript option at a time
- Run type check in CI
- Keep @ts-expect-error comments documented
```

### Phase 4-6: Structure Rollback

Layout and component changes that affect the entire site.

#### Issue: Layout Breaking Site Structure

```bash
# Symptoms
- Pages render incorrectly
- Navigation broken
- Styles not applying

# Rollback Steps
1. Quick fix - revert layout
   git show HEAD~1:src/layouts/BaseLayout.astro > src/layouts/BaseLayout.astro
   
2. If multiple files affected
   git revert <commit-hash>
   
3. Check for dependent changes
   grep -r "BaseLayout" src/
   
4. Test all page types
   - Homepage
   - Content pages  
   - Dynamic routes
   - Error pages

# Prevention
- Test layout changes across all page types
- Use layout versioning (BaseLayoutV2.astro)
- Implement progressive rollout
```

#### Issue: Component Library Breaking Changes

```typescript
// Implement backwards compatibility
// src/components/Button.astro
---
// Support both old and new props
export interface Props {
  // New prop
  variant?: 'primary' | 'secondary' | 'danger';
  // Deprecated but supported
  type?: 'primary' | 'secondary' | 'danger';
  // ... other props
}

const { 
  variant = Astro.props.type || 'primary', // Fallback to old prop
  type, // Capture to prevent prop spreading
  ...props 
} = Astro.props;

// Log deprecation warning in dev
if (type && import.meta.env.DEV) {
  console.warn('Button: "type" prop is deprecated. Use "variant" instead.');
}
---
```

### Phase 7: Content Rollback

Content and asset issues that affect site data.

#### Issue: Broken Content Schema

```bash
# Detection
astro check # Schema validation errors

# Rollback Steps
1. Identify breaking change
   git diff HEAD~1 src/content/config.ts
   
2. For schema addition (safe)
   - Add default values
   - Make fields optional
   
3. For schema removal (dangerous)
   # Create migration script
   node scripts/migrate-content.js --add-missing-fields
   
4. For type changes
   # Backup content first
   cp -r src/content src/content.backup
   
   # Revert schema
   git checkout HEAD~1 -- src/content/config.ts
   
   # Fix content files
   node scripts/fix-content-types.js

# Prevention
- Always make schema changes backwards compatible
- Test with all existing content
- Use optional fields with defaults
```

#### Issue: Image Optimization Breaking Build

```bash
# Symptoms
- Build hangs on image processing
- Out of memory errors
- Corrupted image output

# Rollback Steps
1. Disable optimization temporarily
   # astro.config.mjs
   export default defineConfig({
     image: {
       service: { entrypoint: 'astro/assets/services/noop' }
     }
   });
   
2. Use pre-optimized images
   # Copy from backup
   cp -r backups/images/* public/images/
   
3. Gradual re-enablement
   # Process in batches
   find src/assets -name "*.jpg" | head -20 | xargs -I {} pnpm process-image {}

# Prevention
- Limit concurrent image processing
- Set memory limits in build
- Keep source images under 5MB
```

### Phase 8-9: Quality Rollback

Testing and performance issues.

#### Issue: Test Suite Blocking Deployment

```yaml
# Temporary bypass while fixing
# .github/workflows/ci.yml
jobs:
  test:
    continue-on-error: true # Temporary!
    steps:
      - name: Run tests
        run: pnpm test
        
      - name: Upload failure logs
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: test-failures
          path: test-results/
```

#### Issue: Performance Regression

```typescript
// Feature flag approach
// src/components/HeavyComponent.astro
---
const enableNewFeature = import.meta.env.PUBLIC_ENABLE_HEAVY_FEATURE === 'true';
---

{enableNewFeature ? (
  <NewHeavyComponent />
) : (
  <OldLightComponent />
)}

<!-- Monitor performance -->
<script>
  if (enableNewFeature) {
    // Track performance impact
    performance.mark('heavy-component-start');
    // ... component renders
    performance.mark('heavy-component-end');
    performance.measure('heavy-component', 'heavy-component-start', 'heavy-component-end');
  }
</script>
```

### Phase 10-12: Deployment Rollback

Production issues requiring immediate action.

#### Issue: Failed Deployment

```bash
# Cloudflare Pages Rollback
1. Go to Cloudflare Dashboard
2. Select your project
3. Go to "Deployments" tab
4. Find last successful deployment
5. Click "Rollback to this deployment"

# CLI Rollback
wrangler pages deployments list
wrangler pages rollback --deployment-id <id>

# Vercel Rollback
vercel rollback
vercel rollback <deployment-url>

# Netlify Rollback
netlify deploy --prod --alias rollback
netlify rollback
```

#### Issue: Production Error Spike

```typescript
// Emergency error boundary
// src/layouts/ErrorBoundary.astro
---
export interface Props {
  fallback?: string;
}

const { fallback = '/maintenance' } = Astro.props;
---

<script define:vars={{ fallback }}>
  window.addEventListener('error', (event) => {
    // Log to monitoring
    if (window.Sentry) {
      window.Sentry.captureException(event.error);
    }
    
    // Check error threshold
    const errorCount = parseInt(sessionStorage.getItem('errorCount') || '0');
    if (errorCount > 5) {
      // Too many errors, show maintenance page
      window.location.href = fallback;
    } else {
      sessionStorage.setItem('errorCount', (errorCount + 1).toString());
    }
  });
</script>
```

## Automated Rollback Systems

### 1. Build Pipeline Rollback

```yaml
# .github/workflows/deploy.yml
name: Deploy with Automatic Rollback

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Get previous deployment ID
        id: previous
        run: |
          echo "deployment_id=$(cat .last-deployment)" >> $GITHUB_OUTPUT
          
      - name: Build and Deploy
        id: deploy
        run: |
          pnpm install
          pnpm build
          pnpm deploy
          echo $DEPLOYMENT_ID > .last-deployment
          
      - name: Health Check
        id: health
        run: |
          sleep 30 # Wait for deployment
          curl -f https://your-site.com/health || exit 1
          
      - name: Performance Check
        id: performance
        run: |
          # Run Lighthouse CI
          lhci autorun
          
      - name: Rollback if Failed
        if: failure()
        run: |
          echo "Deployment failed, rolling back to ${{ steps.previous.outputs.deployment_id }}"
          pnpm rollback --to ${{ steps.previous.outputs.deployment_id }}
```

### 2. Canary Deployment

```typescript
// src/middleware.ts
import type { MiddlewareResponseHandler } from 'astro';

export const onRequest: MiddlewareResponseHandler = async (context, next) => {
  const response = await next();
  
  // Canary routing logic
  const isCanary = Math.random() < 0.1; // 10% canary
  
  if (isCanary) {
    // Route to new version
    response.headers.set('X-Version', 'canary');
    
    // Track canary metrics
    context.locals.version = 'canary';
  } else {
    response.headers.set('X-Version', 'stable');
    context.locals.version = 'stable';
  }
  
  return response;
};

// Monitor canary performance
export function trackCanaryMetrics(version: string, metric: string, value: number) {
  // Send to monitoring service
  fetch('/api/metrics', {
    method: 'POST',
    body: JSON.stringify({ version, metric, value })
  });
}
```

### 3. Database Rollback

```typescript
// scripts/db-rollback.ts
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

async function rollbackDatabase(targetVersion: string) {
  const migrationsDir = './migrations';
  const migrations = await readdir(migrationsDir);
  
  // Find migrations to rollback
  const currentVersion = await getCurrentVersion();
  const toRollback = migrations
    .filter(m => m > currentVersion && m <= targetVersion)
    .sort()
    .reverse();
  
  for (const migration of toRollback) {
    console.log(`Rolling back ${migration}...`);
    const content = await readFile(join(migrationsDir, migration, 'down.sql'), 'utf-8');
    
    try {
      await executeSql(content);
      await updateVersion(migration.replace('.sql', ''));
    } catch (error) {
      console.error(`Failed to rollback ${migration}:`, error);
      throw error;
    }
  }
}

// Usage
rollbackDatabase('20240115120000');
```

## Recovery Procedures

### 1. Corrupted Build Cache

```bash
#!/bin/bash
# scripts/clean-build.sh

echo "🧹 Cleaning build artifacts..."

# Remove all build caches
rm -rf .astro
rm -rf dist
rm -rf .cache
rm -rf node_modules/.cache
rm -rf .parcel-cache

# Clear package manager cache
pnpm store prune

# Clear OS temp files
rm -rf $TMPDIR/astro-*

# Reinstall dependencies
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install

echo "✅ Clean build environment ready"
```

### 2. Git Repository Recovery

```bash
#!/bin/bash
# scripts/recover-repo.sh

# Recover from corrupted git objects
git fsck --full

# Recover lost commits
git reflog
git checkout -b recovery <commit-hash>

# Recover deleted files
git rev-list -n 1 HEAD -- <deleted-file>
git checkout <commit-hash>^ -- <deleted-file>

# Clean up repository
git gc --aggressive --prune=now
```

### 3. Emergency Maintenance Mode

```astro
---
// src/pages/maintenance.astro
// Deploy this as index.astro in emergencies
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Maintenance - We'll be back soon!</title>
  <style>
    body {
      font-family: system-ui;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 { color: #333; }
    p { color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>We'll be back soon!</h1>
    <p>We're performing some maintenance. Please check back in a few minutes.</p>
    <p>If you need immediate assistance, please contact support@example.com</p>
  </div>
  <script>
    // Auto-refresh every 30 seconds
    setTimeout(() => location.reload(), 30000);
  </script>
</body>
</html>
```

## Monitoring and Alerts

### 1. Health Check Endpoints

```typescript
// src/pages/api/health.json.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.DEPLOYMENT_ID || 'unknown',
    checks: {
      database: await checkDatabase(),
      cache: await checkCache(),
      storage: await checkStorage(),
    }
  };
  
  const isHealthy = Object.values(checks.checks).every(check => check.status === 'ok');
  
  return new Response(JSON.stringify(checks), {
    status: isHealthy ? 200 : 503,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
};

async function checkDatabase() {
  try {
    // Perform database check
    return { status: 'ok', latency: 5 };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}
```

### 2. Automated Rollback Triggers

```typescript
// monitoring/rollback-monitor.ts
interface HealthMetrics {
  errorRate: number;
  responseTime: number;
  successRate: number;
}

class RollbackMonitor {
  private thresholds = {
    errorRate: 0.05, // 5% error rate
    responseTime: 3000, // 3 seconds
    successRate: 0.95 // 95% success rate
  };
  
  async checkHealth(deploymentId: string): Promise<boolean> {
    const metrics = await this.getMetrics(deploymentId);
    
    if (metrics.errorRate > this.thresholds.errorRate) {
      console.error(`Error rate ${metrics.errorRate} exceeds threshold`);
      return false;
    }
    
    if (metrics.responseTime > this.thresholds.responseTime) {
      console.error(`Response time ${metrics.responseTime}ms exceeds threshold`);
      return false;
    }
    
    if (metrics.successRate < this.thresholds.successRate) {
      console.error(`Success rate ${metrics.successRate} below threshold`);
      return false;
    }
    
    return true;
  }
  
  async triggerRollback(fromDeployment: string, toDeployment: string) {
    console.log(`Triggering rollback from ${fromDeployment} to ${toDeployment}`);
    
    // Notify team
    await this.notifyTeam({
      type: 'rollback',
      from: fromDeployment,
      to: toDeployment,
      reason: 'Automated health check failure'
    });
    
    // Execute rollback
    await this.executeRollback(toDeployment);
  }
}
```

## Rollback Checklists

### Pre-Deployment Checklist

```markdown
## Before Deploying

### Backups
- [ ] Database backup completed
- [ ] Static assets backed up
- [ ] Configuration backed up
- [ ] Previous deployment ID noted

### Testing
- [ ] All tests passing locally
- [ ] Staging environment tested
- [ ] Rollback procedure tested
- [ ] Health checks verified

### Team
- [ ] Team notified of deployment
- [ ] On-call engineer available
- [ ] Rollback approver identified
- [ ] Communication channels open
```

### During Incident Checklist

```markdown
## Incident Response

### Immediate Actions (0-5 minutes)
- [ ] Acknowledge incident
- [ ] Assess severity
- [ ] Notify stakeholders
- [ ] Begin diagnosis

### Decision Point (5-15 minutes)
- [ ] Can issue be fixed forward?
- [ ] Is rollback necessary?
- [ ] What is the impact?
- [ ] Get rollback approval

### Rollback Execution (15-30 minutes)
- [ ] Execute rollback procedure
- [ ] Verify rollback successful
- [ ] Monitor metrics
- [ ] Update status page

### Post-Rollback (30+ minutes)
- [ ] Confirm stability
- [ ] Document timeline
- [ ] Schedule retrospective
- [ ] Plan fix forward
```

### Post-Incident Checklist

```markdown
## Post-Incident Review

### Data Collection
- [ ] Timeline documented
- [ ] Metrics captured
- [ ] Logs preserved
- [ ] Team feedback gathered

### Analysis
- [ ] Root cause identified
- [ ] Impact assessed
- [ ] Decision points reviewed
- [ ] Process gaps found

### Improvements
- [ ] Runbook updated
- [ ] Monitoring enhanced
- [ ] Tests added
- [ ] Training planned
```

## Common Rollback Scenarios

### 1. CSS/Styling Regression

```bash
# Quick fix: inject old styles
cat > public/hotfix.css << EOF
/* Emergency style fixes */
.broken-component {
  /* Old styles that worked */
}
EOF

# Add to head
<link rel="stylesheet" href="/hotfix.css">
```

### 2. JavaScript Error

```javascript
// Add error boundary to prevent cascade
window.addEventListener('error', function(e) {
  if (e.filename.includes('problem-script.js')) {
    e.preventDefault();
    console.error('Known issue, prevented:', e);
    // Load fallback functionality
    import('/fallback-script.js');
  }
});
```

### 3. API Breaking Change

```typescript
// Version detection and routing
export async function apiCall(endpoint: string, data: any) {
  const apiVersion = getApiVersion();
  
  if (apiVersion === 'v2' && hasV2Issues()) {
    // Route to v1 temporarily
    return fetch(endpoint.replace('/v2/', '/v1/'), {
      method: 'POST',
      body: transformDataForV1(data)
    });
  }
  
  return fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
```

## Best Practices

### 1. Rollback Speed

```yaml
# Optimization for fast rollbacks
- Use CDN instant rollback
- Keep deployment artifacts
- Maintain hot standby
- Cache previous builds
- Automate decision trees
```

### 2. Data Integrity

```typescript
// Always version your data operations
interface Migration {
  version: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
  validate: () => Promise<boolean>;
}

// Implement two-phase rollback
async function safeRollback(migration: Migration) {
  // Phase 1: Prepare rollback
  const backup = await createBackup();
  
  try {
    // Phase 2: Execute rollback
    await migration.down();
    
    // Validate
    const isValid = await migration.validate();
    if (!isValid) {
      throw new Error('Rollback validation failed');
    }
  } catch (error) {
    // Restore from backup
    await restoreBackup(backup);
    throw error;
  }
}
```

### 3. Communication

```typescript
// Automated status updates
class IncidentCommunicator {
  async updateStatus(phase: 'detected' | 'investigating' | 'rolling-back' | 'resolved') {
    const messages = {
      'detected': 'We are aware of an issue affecting our service.',
      'investigating': 'Our team is investigating the issue.',
      'rolling-back': 'We are reverting to a previous stable version.',
      'resolved': 'The issue has been resolved.'
    };
    
    // Update status page
    await updateStatusPage(messages[phase]);
    
    // Notify via webhook
    await notifyWebhook({
      text: messages[phase],
      severity: phase === 'resolved' ? 'info' : 'warning'
    });
    
    // Log for audit
    console.log(`[${new Date().toISOString()}] Status: ${phase}`);
  }
}
```

## Recovery Time Objectives

| Component | RTO Target | Actual Process Time |
|-----------|------------|-------------------|
| **CDN Rollback** | < 1 minute | 30 seconds |
| **Application Rollback** | < 5 minutes | 2-3 minutes |
| **Database Rollback** | < 15 minutes | 5-10 minutes |
| **Full Stack Rollback** | < 30 minutes | 15-20 minutes |

## Lessons Learned Database

Keep a record of all rollbacks for continuous improvement:

```yaml
# rollbacks/2024-01-15-performance-regression.yml
incident:
  date: 2024-01-15
  duration: 45 minutes
  severity: medium
  
trigger:
  type: automated
  metric: response_time
  threshold_exceeded: 3500ms
  
root_cause:
  component: image-optimization
  issue: memory_leak
  introduced_in: v2.3.0
  
resolution:
  action: rollback
  from_version: v2.3.0
  to_version: v2.2.9
  time_to_resolve: 15 minutes
  
lessons:
  - Add memory profiling to CI
  - Implement gradual rollout
  - Enhance monitoring granularity
  
follow_up:
  - Fixed in v2.3.1
  - Added regression tests
  - Updated deployment checklist
```

Remember: The best rollback is the one you never need. Invest in prevention, but be prepared for rapid recovery when issues arise.
