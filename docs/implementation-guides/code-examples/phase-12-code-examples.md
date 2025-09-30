---
title: Phase 12 - Code Examples  
lastUpdated: true
description: >-
  Code examples for Phase 12
tableOfContents: true
pagefind: true
---

## Monitoring Setup

### 1. Performance Dashboard

```typescript
// scripts/create-dashboard.ts
import { createClient } from '@supabase/supabase-js';

interface PerformanceMetric {
  timestamp: Date;
  metric: string;
  value: number;
  page: string;
  percentile: number;
}

class PerformanceDashboard {
  private supabase;
  
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }
  
  async createTables() {
    // Core Web Vitals table
    await this.supabase.sql`
      CREATE TABLE IF NOT EXISTS web_vitals (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        metric VARCHAR(10) NOT NULL,
        value NUMERIC NOT NULL,
        rating VARCHAR(10),
        page VARCHAR(255) NOT NULL,
        user_agent TEXT,
        connection_type VARCHAR(20),
        INDEX idx_timestamp (timestamp),
        INDEX idx_metric_page (metric, page)
      );
    `;
    
    // Performance summary view
    await this.supabase.sql`
      CREATE OR REPLACE VIEW performance_summary AS
      SELECT 
        DATE_TRUNC('hour', timestamp) as hour,
        metric,
        page,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY value) as p75,
        PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY value) as p90,
        COUNT(*) as sample_count
      FROM web_vitals
      WHERE timestamp > NOW() - INTERVAL '7 days'
      GROUP BY hour, metric, page;
    `;
  }
  
  async createDashboard() {
    // Grafana dashboard JSON
    const dashboard = {
      dashboard: {
        title: "Web Performance Monitoring",
        panels: [
          {
            title: "Core Web Vitals - P75",
            type: "graph",
            targets: [
              {
                rawSql: `
                  SELECT 
                    hour as time,
                    p75 as "LCP"
                  FROM performance_summary
                  WHERE metric = 'LCP'
                    AND page = '/'
                  ORDER BY hour
                `
              }
            ]
          },
          {
            title: "Performance Score Trend",
            type: "stat",
            targets: [
              {
                rawSql: `
                  SELECT 
                    AVG(CASE 
                      WHEN metric = 'LCP' AND value < 2500 THEN 1
                      WHEN metric = 'FID' AND value < 100 THEN 1
                      WHEN metric = 'CLS' AND value < 0.1 THEN 1
                      ELSE 0
                    END) * 100 as "Score"
                  FROM web_vitals
                  WHERE timestamp > NOW() - INTERVAL '24 hours'
                `
              }
            ]
          }
        ]
      }
    };
    
    // Save dashboard configuration
    await fetch('https://grafana.yourdomain.com/api/dashboards/db', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GRAFANA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dashboard)
    });
  }
}
```

### 2. Analytics Dashboard

```astro


***


// src/pages/admin/analytics.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import { getAnalytics } from '@/lib/analytics';

// Protect admin route
if (!Astro.locals.user?.isAdmin) {
  return Astro.redirect('/login');
}

const analytics = await getAnalytics({
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  endDate: new Date()
});


***



<BaseLayout title="Analytics Dashboard">
  <div class="container py-8">
    <h1 class="text-3xl font-bold mb-8">Analytics Dashboard</h1>
    
    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 class="text-sm font-medium text-gray-500">Page Views</h3>
        <p class="text-3xl font-bold">{analytics.pageViews.toLocaleString()}</p>
        <p class="text-sm text-green-600">+12% from last period</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 class="text-sm font-medium text-gray-500">Unique Visitors</h3>
        <p class="text-3xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</p>
        <p class="text-sm text-green-600">+8% from last period</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 class="text-sm font-medium text-gray-500">Avg. Duration</h3>
        <p class="text-3xl font-bold">{analytics.avgDuration}</p>
        <p class="text-sm text-red-600">-5% from last period</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 class="text-sm font-medium text-gray-500">Bounce Rate</h3>
        <p class="text-3xl font-bold">{analytics.bounceRate}%</p>
        <p class="text-sm text-green-600">-3% from last period</p>
      </div>
    </div>
    
    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Traffic Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Traffic Over Time</h3>
        <canvas id="traffic-chart"></canvas>
      </div>
      
      <!-- Top Pages -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Top Pages</h3>
        <div class="space-y-3">
          {analytics.topPages.map((page) => (
            <div class="flex justify-between items-center">
              <span class="text-sm">{page.path}</span>
              <span class="text-sm font-medium">{page.views.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  
  <script>
    import Chart from 'chart.js/auto';
    
    // Traffic chart
    const ctx = document.getElementById('traffic-chart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: {analytics.dailyTraffic.map(d => d.date)},
        datasets: [{
          label: 'Page Views',
          data: {analytics.dailyTraffic.map(d => d.views)},
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  </script>
</BaseLayout>
```

## Feedback Systems

### 1. User Feedback Widget

```astro


***


// src/components/FeedbackWidget.astro


***



<div class="feedback-widget">
  <button
    id="feedback-trigger"
    class="fixed bottom-4 right-4 bg-primary-600 text-white rounded-full p-3 shadow-lg hover:bg-primary-700 transition-colors"
    aria-label="Send feedback"
  >
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  </button>
  
  <div id="feedback-modal" class="hidden fixed inset-0 z-50 items-center justify-center p-4 bg-black bg-opacity-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
      <h3 class="text-lg font-semibold mb-4">Send Feedback</h3>
      
      <form id="feedback-form">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">How's your experience?</label>
          <div class="flex gap-2">
            {['😞', '😐', '😊', '😍'].map((emoji, i) => (
              <button
                type="button"
                class="rating-btn text-2xl p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                data-rating={i + 1}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        
        <div class="mb-4">
          <label for="feedback-message" class="block text-sm font-medium mb-2">
            Your feedback (optional)
          </label>
          <textarea
            id="feedback-message"
            rows="3"
            class="w-full rounded-md border-gray-300 dark:border-gray-600"
            placeholder="Tell us what you think..."
          ></textarea>
        </div>
        
        <div class="flex gap-3">
          <button
            type="submit"
            class="flex-1 bg-primary-600 text-white rounded-md py-2 hover:bg-primary-700"
          >
            Send Feedback
          </button>
          <button
            type="button"
            id="cancel-feedback"
            class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-md py-2 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<script>
  const trigger = document.getElementById('feedback-trigger');
  const modal = document.getElementById('feedback-modal');
  const form = document.getElementById('feedback-form');
  const cancelBtn = document.getElementById('cancel-feedback');
  let selectedRating = 0;
  
  // Open modal
  trigger?.addEventListener('click', () => {
    modal?.classList.remove('hidden');
  });
  
  // Close modal
  cancelBtn?.addEventListener('click', () => {
    modal?.classList.add('hidden');
  });
  
  // Rating selection
  document.querySelectorAll('.rating-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.dataset.rating || '0');
      document.querySelectorAll('.rating-btn').forEach(b => {
        b.classList.remove('bg-primary-100', 'dark:bg-primary-900');
      });
      btn.classList.add('bg-primary-100', 'dark:bg-primary-900');
    });
  });
  
  // Submit feedback
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = (document.getElementById('feedback-message') as HTMLTextAreaElement)?.value;
    
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating: selectedRating,
        message,
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      })
    });
    
    modal?.classList.add('hidden');
    
    // Show thank you message
    const thanks = document.createElement('div');
    thanks.className = 'fixed bottom-4 right-4 bg-green-600 text-white rounded-lg p-4';
    thanks.textContent = 'Thank you for your feedback!';
    document.body.appendChild(thanks);
    
    setTimeout(() => thanks.remove(), 3000);
  });
</script>
```

### 2. A/B Testing Framework (Showcase)

```typescript
// src/lib/ab-testing.ts
interface Experiment {
  id: string;
  name: string;
  variants: {
    id: string;
    weight: number;
  }[];
  goals: string[];
}

class ABTesting {
  private experiments: Map<string, Experiment> = new Map();
  private assignments: Map<string, string> = new Map();
  
  constructor() {
    this.loadExperiments();
    this.loadAssignments();
  }
  
  private loadExperiments() {
    // Load active experiments
    this.experiments.set('homepage-cta', {
      id: 'homepage-cta',
      name: 'Homepage CTA Test',
      variants: [
        { id: 'control', weight: 0.5 },
        { id: 'variant-a', weight: 0.25 },
        { id: 'variant-b', weight: 0.25 }
      ],
      goals: ['click-cta', 'signup']
    });
  }
  
  private loadAssignments() {
    // Load user assignments from cookie/localStorage
    const stored = localStorage.getItem('ab-assignments');
    if (stored) {
      this.assignments = new Map(JSON.parse(stored));
    }
  }
  
  getVariant(experimentId: string): string {
    // Check existing assignment
    const assigned = this.assignments.get(experimentId);
    if (assigned) return assigned;
    
    // Get experiment
    const experiment = this.experiments.get(experimentId);
    if (!experiment) return 'control';
    
    // Assign variant based on weights
    const random = Math.random();
    let cumulative = 0;
    
    for (const variant of experiment.variants) {
      cumulative += variant.weight;
      if (random <= cumulative) {
        this.assignments.set(experimentId, variant.id);
        this.saveAssignments();
        this.trackAssignment(experimentId, variant.id);
        return variant.id;
      }
    }
    
    return 'control';
  }
  
  trackGoal(goalName: string, value?: number) {
    // Track conversion for all active experiments
    this.experiments.forEach((experiment, experimentId) => {
      if (experiment.goals.includes(goalName)) {
        const variant = this.assignments.get(experimentId);
        if (variant) {
          this.sendEvent({
            type: 'goal',
            experiment: experimentId,
            variant,
            goal: goalName,
            value
          });
        }
      }
    });
  }
  
  private trackAssignment(experimentId: string, variantId: string) {
    this.sendEvent({
      type: 'assignment',
      experiment: experimentId,
      variant: variantId
    });
  }
  
  private saveAssignments() {
    localStorage.setItem('ab-assignments', 
      JSON.stringify(Array.from(this.assignments.entries()))
    );
  }
  
  private sendEvent(event: any) {
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'experiment', event);
    }
  }
}

export const abTesting = new ABTesting();
```

## Growth & Optimization

### 1. SEO Monitoring

```typescript
// scripts/seo-monitor.ts
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

class SEOMonitor {
  private searchConsole;
  private supabase;
  
  constructor() {
    this.searchConsole = google.searchconsole('v1');
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );
  }
  
  async fetchSearchConsoleData() {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'service-account.json',
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
    });
    
    const authClient = await auth.getClient();
    google.options({ auth: authClient });
    
    // Fetch performance data
    const response = await this.searchConsole.searchanalytics.query({
      siteUrl: 'https://yourdomain.com',
      requestBody: {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        dimensions: ['query', 'page'],
        dimensionFilterGroups: [{
          filters: [{
            dimension: 'country',
            expression: 'usa'
          }]
        }],
        rowLimit: 1000
      }
    });
    
    // Store in database
    for (const row of response.data.rows || []) {
      await this.supabase.from('seo_performance').insert({
        query: row.keys[0],
        page: row.keys[1],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
        date: new Date()
      });
    }
  }
  
  async generateReport() {
    // Top performing queries
    const topQueries = await this.supabase
      .from('seo_performance')
      .select('query, SUM(clicks) as total_clicks')
      .order('total_clicks', { ascending: false })
      .limit(20);
    
    // Pages needing optimization (high impressions, low CTR)
    const optimizationTargets = await this.supabase
      .from('seo_performance')
      .select('*')
      .filter('impressions', 'gt', 100)
      .filter('ctr', 'lt', 0.02)
      .order('impressions', { ascending: false });
    
    // Position tracking
    const positionTrends = await this.supabase
      .from('seo_performance')
      .select('query, date, position')
      .order('date');
    
    return {
      topQueries,
      optimizationTargets,
      positionTrends
    };
  }
}
```

### 2. Content Performance Tracking

```astro


***


// src/pages/admin/content-performance.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import { getContentMetrics } from '@/lib/analytics';

const metrics = await getContentMetrics();


***



<BaseLayout title="Content Performance">
  <div class="container py-8">
    <h1 class="text-3xl font-bold mb-8">Content Performance</h1>
    
    <!-- Blog Post Performance -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-6">Blog Posts</h2>
      <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg. Time
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shares
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conversion
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            {metrics.posts.map((post) => (
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <a href={post.url} class="text-primary-600 hover:underline">
                    {post.title}
                  </a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {post.views.toLocaleString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {post.avgTime}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {post.shares}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class={`px-2 py-1 text-xs rounded-full ${
                    post.conversion > 5 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {post.conversion}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
    
    <!-- Content Recommendations -->
    <section>
      <h2 class="text-2xl font-semibold mb-6">Optimization Recommendations</h2>
      <div class="grid gap-6">
        {metrics.recommendations.map((rec) => (
          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 class="font-semibold mb-2">{rec.title}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{rec.description}</p>
            <div class="flex items-center justify-between">
              <span class="text-sm">
                Potential impact: <strong>{rec.impact}</strong>
              </span>
              <button class="text-sm text-primary-600 hover:underline">
                Take Action →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
</BaseLayout>
```

## Maintenance Schedule

### Daily Tasks

```yaml
# .github/workflows/daily-maintenance.yml
name: Daily Maintenance

on:
  schedule:
    - cron: '0 9 * * *' # 9 AM UTC daily
  workflow_dispatch:

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check site health
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com/api/health)
          if [ $response != "200" ]; then
            echo "Site health check failed with status $response"
            exit 1
          fi
          
      - name: Check SSL certificate
        run: |
          expiry=$(echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
          expiry_epoch=$(date -d "$expiry" +%s)
          current_epoch=$(date +%s)
          days_left=$(( ($expiry_epoch - $current_epoch) / 86400 ))
          
          if [ $days_left -lt 30 ]; then
            echo "SSL certificate expiring in $days_left days"
            exit 1
          fi
          
      - name: Performance check
        run: |
          npx lighthouse https://yourdomain.com \
            --only-categories=performance \
            --chrome-flags="--headless" \
            --output=json \
            --output-path=./lighthouse.json
            
          score=$(jq '.categories.performance.score' lighthouse.json)
          if (( $(echo "$score < 0.95" | bc -l) )); then
            echo "Performance score dropped to $score"
            exit 1
          fi
```
