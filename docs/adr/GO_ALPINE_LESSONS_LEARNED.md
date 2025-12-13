# Lessons Learned from ADR History for Go/Alpine Lightweight Web Apps

**Date**: 2025-11-15  
**Context**: Analysis of Astro starter template ADRs for patterns applicable to Go/Alpine web applications  
**Source**: ADRs 000-021 from Astro Performance Starter Template

---

## Executive Summary

This document extracts architectural lessons from 21 ADRs in an Astro performance starter template and translates them into actionable patterns for Go/Alpine-based lightweight web applications. Key themes: performance-first architecture, progressive enhancement, minimal tooling, and defensive programming.

---

## Core Architectural Principles

### 1. Performance as a First-Class Requirement

**Lesson from ADR-000, ADR-020**

The Astro template establishes **hard performance budgets** upfront:

- Lighthouse scores: 95+ (Performance), 98+ (Accessibility)
- Bundle sizes: JS < 160KB, CSS < 50KB
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

**Application to Go/Alpine:**

```go
// Define performance budgets in code
const (
    MaxResponseTime     = 100 * time.Millisecond  // P95 response time
    MaxBinarySize       = 20 * 1024 * 1024        // 20MB max binary
    MaxMemoryUsage      = 128 * 1024 * 1024       // 128MB max RSS
    MaxConcurrentConns  = 10000                    // Connection limit
)

// Enforce in CI/CD
func TestPerformanceBudgets(t *testing.T) {
    binary := getBinarySize()
    if binary > MaxBinarySize {
        t.Fatalf("Binary size %d exceeds budget %d", binary, MaxBinarySize)
    }
}
```

**Key Takeaways:**

- Define budgets **before** implementation
- Make budgets **testable** and **enforceable** in CI
- Use budgets to guide architectural decisions (e.g., "Can we afford this dependency?")

---

### 2. Minimal Tooling Philosophy

**Lesson from ADR-000, ADR-004**

The template chose **Biome over ESLint+Prettier** (20x faster, single tool) and made design system tooling **optional** for MVP track.

**Application to Go/Alpine:**

```dockerfile
# Minimal Alpine base - no unnecessary packages
FROM alpine:3.19
RUN apk add --no-cache ca-certificates tzdata

# Single-stage build for simplicity
FROM golang:1.21-alpine AS builder
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o app

FROM alpine:3.19
COPY --from=builder /build/app /app
ENTRYPOINT ["/app"]
```

**Key Takeaways:**

- Prefer single-purpose tools over tool sprawl
- Make advanced tooling **optional** (e.g., observability, tracing)
- Alpine's minimalism aligns with "only install what you need"
- Use multi-stage builds to keep runtime image tiny

---

### 3. Build-Time Optimization Over Runtime

**Lesson from ADR-012, ADR-020**

The blog optimized by moving sorting/navigation to `getStaticPaths` (runs once) instead of per-page (runs N times). Reduced O(n²) to O(n log n).

**Application to Go/Alpine:**

```go
// ❌ Runtime computation (slow)
func HandleBlogPost(w http.ResponseWriter, r *http.Request) {
    allPosts := fetchAllPosts()        // Database query
    sort.Slice(allPosts, ...)          // Sort on every request
    prevPost, nextPost := findNav(allPosts, currentSlug)
    render(w, post, prevPost, nextPost)
}

// ✅ Build-time precomputation (fast)
var postNavigation = precomputeNavigation() // Computed at startup

func init() {
    posts := fetchAllPosts()
    sort.Slice(posts, ...)
    for i, post := range posts {
        postNavigation[post.Slug] = Navigation{
            Prev: posts[i-1],
            Next: posts[i+1],
        }
    }
}

func HandleBlogPost(w http.ResponseWriter, r *http.Request) {
    nav := postNavigation[slug]  // O(1) lookup
    render(w, post, nav.Prev, nav.Next)
}
```

**Key Takeaways:**

- Precompute expensive operations at startup
- Use `init()` or startup hooks for one-time computations
- Cache static data in memory (Go's low memory footprint makes this viable)
- For truly static sites, consider generating HTML at build time

---

### 4. Graceful Degradation and Defensive Programming

**Lesson from ADR-011, ADR-021**

Dynamic routes check for `null` posts and redirect to 404 instead of crashing. Forms work without JavaScript (progressive enhancement).

**Application to Go/Alpine:**

```go
// ✅ Defensive route handling
func HandleBlogPost(w http.ResponseWriter, r *http.Request) {
    slug := chi.URLParam(r, "slug")
    
    post, err := getPost(slug)
    if err != nil || post == nil {
        // Graceful degradation: redirect to 404, don't crash
        http.Redirect(w, r, "/404", http.StatusSeeOther)
        return
    }
    
    // Defensive: check for missing navigation
    nav := postNavigation[slug]
    if nav.Prev == nil {
        nav.Prev = &Post{Title: "No previous post"}
    }
    
    render(w, post, nav)
}

// ✅ Progressive enhancement: forms work without JS
func HandleContactForm(w http.ResponseWriter, r *http.Request) {
    if r.Method == "POST" {
        // Native form submission works
        email := r.FormValue("email")
        if email == "" {
            // Server-side validation (no JS required)
            renderError(w, "Email required")
            return
        }
        // Process form...
        http.Redirect(w, r, "/thank-you", http.StatusSeeOther)
        return
    }
    
    // GET: render form
    renderForm(w)
}
```

**Key Takeaways:**

- **Fail gracefully**: Redirect to error pages, don't panic
- **Validate on server**: Never trust client-side validation
- **Progressive enhancement**: Core functionality works without JS
- **Explicit nil checks**: Document edge cases with comments

---

### 5. Documentation as Code

**Lesson from ADR-005, ADR-006, ADR-008**

The template uses:

- **Build-time link validation** (ADR-005): Catch broken docs before deployment
- **Automated review cadence** (ADR-006): Frontmatter `review: "2025-12-31"` triggers CI checks
- **Automated docs sync** (ADR-008): GitHub Actions sync docs to Starlight site

**Application to Go/Alpine:**

```go
// Embed documentation in binary
//go:embed docs/*.md
var docsFS embed.FS

// Serve docs at /docs
func setupDocs(r chi.Router) {
    r.Get("/docs/*", func(w http.ResponseWriter, r *http.Request) {
        http.FileServer(http.FS(docsFS)).ServeHTTP(w, r)
    })
}

// Validate docs at build time
//go:generate go run scripts/validate-docs.go

// scripts/validate-docs.go
func main() {
    // Check for broken links
    // Validate frontmatter
    // Ensure review dates are current
}
```

**Key Takeaways:**

- **Embed docs in binary** using `//go:embed` (no separate docs server)
- **Validate at build time** using `//go:generate`
- **Automate reviews**: Use CI to check doc freshness
- **Single source of truth**: Docs live with code

---

## Performance Patterns for Go/Alpine

### 1. Static Asset Optimization

**Lesson from ADR-012, ADR-020**

Images use `loading="lazy"`, `decoding="async"`, and responsive formats (AVIF).

**Application to Go/Alpine:**

```go
// Serve static assets with aggressive caching
func setupStatic(r chi.Router) {
    fileServer := http.FileServer(http.Dir("./static"))
    
    r.Get("/static/*", func(w http.ResponseWriter, r *http.Request) {
        // Cache static assets for 1 year
        w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
        
        // Serve pre-compressed files if available
        if strings.HasSuffix(r.URL.Path, ".js") || strings.HasSuffix(r.URL.Path, ".css") {
            if acceptsEncoding(r, "br") {
                if _, err := os.Stat("./static" + r.URL.Path + ".br"); err == nil {
                    w.Header().Set("Content-Encoding", "br")
                    http.ServeFile(w, r, "./static"+r.URL.Path+".br")
                    return
                }
            }
        }
        
        fileServer.ServeHTTP(w, r)
    })
}
```

**Key Takeaways:**

- Pre-compress assets (Brotli, Gzip) at build time
- Use aggressive caching for immutable assets
- Serve from CDN or edge locations (Cloudflare, Fastly)

---

### 2. Lazy Loading and Code Splitting

**Lesson from ADR-001, ADR-020**

Use `client:visible` for below-fold components, `client:idle` for non-critical features.

**Application to Go/Alpine:**

```go
// Lazy load non-critical features
func HandleHomepage(w http.ResponseWriter, r *http.Request) {
    // Critical: above-the-fold content
    hero := renderHero()
    
    // Non-critical: below-the-fold (lazy load via HTMX or similar)
    testimonials := `<div hx-get="/api/testimonials" hx-trigger="revealed">Loading...</div>`
    
    render(w, hero, testimonials)
}

// Separate endpoint for lazy-loaded content
func HandleTestimonials(w http.ResponseWriter, r *http.Request) {
    testimonials := fetchTestimonials()
    renderPartial(w, testimonials)
}
```

**Key Takeaways:**

- Use HTMX or similar for lazy-loading HTML fragments
- Separate critical (above-fold) from non-critical (below-fold)
- Consider server-side rendering for SEO-critical content

---

### 3. Database Query Optimization

**Lesson from ADR-012**

Avoid N+1 queries by precomputing relationships.

**Application to Go/Alpine:**

```go
// ❌ N+1 query problem
func GetBlogPosts() []Post {
    posts := db.Query("SELECT * FROM posts")
    for i := range posts {
        posts[i].Author = db.QueryRow("SELECT * FROM authors WHERE id = ?", posts[i].AuthorID)
        posts[i].Tags = db.Query("SELECT * FROM tags WHERE post_id = ?", posts[i].ID)
    }
    return posts
}

// ✅ Preload relationships
func GetBlogPosts() []Post {
    posts := db.Query("SELECT * FROM posts")
    
    // Batch load authors
    authorIDs := extractIDs(posts, "AuthorID")
    authors := db.Query("SELECT * FROM authors WHERE id IN (?)", authorIDs)
    authorMap := indexBy(authors, "ID")
    
    // Batch load tags
    postIDs := extractIDs(posts, "ID")
    tags := db.Query("SELECT * FROM tags WHERE post_id IN (?)", postIDs)
    tagMap := groupBy(tags, "PostID")
    
    // Assign relationships
    for i := range posts {
        posts[i].Author = authorMap[posts[i].AuthorID]
        posts[i].Tags = tagMap[posts[i].ID]
    }
    
    return posts
}
```

**Key Takeaways:**

- Use batch queries to avoid N+1 problems
- Preload relationships at startup for static data
- Consider caching frequently accessed data in memory

---

## Accessibility Patterns

**Lesson from ADR-018, ADR-019**

The template enforces WCAG AA compliance with:

- Skip links for keyboard navigation
- Semantic HTML (landmarks, headings)
- ARIA labels for decorative elements
- Form validation without JavaScript

**Application to Go/Alpine:**

```go
// Template helpers for accessibility
func renderSkipLink() string {
    return `<a href="#main-content" class="skip-link">Skip to main content</a>`
}

func renderForm() string {
    return `
    <form action="/contact" method="POST">
        <label for="email">Email Address</label>
        <input 
            id="email" 
            type="email" 
            name="email" 
            required 
            aria-describedby="email-help"
        />
        <span id="email-help">We'll never share your email</span>
        
        <button type="submit">Send</button>
    </form>
    `
}
```

**Key Takeaways:**

- Use semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`)
- Provide skip links for keyboard users
- Associate labels with inputs (`for`/`id`)
- Validate on server (don't rely on client-side validation)

---

## Missing ADRs Identified

Based on the existing ADR history, the following topics are **missing** and should be documented:

### 1. **ADR-007: [Missing] - Unknown Topic**

- **Gap**: ADR numbering skips from 006 to 008
- **Recommendation**: Document what ADR-007 was intended for or mark as reserved

### 2. **ADR-016: [Missing] - Unknown Topic**

- **Gap**: ADR numbering skips from 015 to 017
- **Recommendation**: Document what ADR-016 was intended for or mark as reserved

### 3. **Error Handling Strategy**

- **Gap**: No ADR documents error handling patterns (logging, monitoring, alerting)
- **Recommendation**: Create ADR for error handling, structured logging, and observability

### 4. **Environment Configuration Management**

- **Gap**: ADR-021 mentions environment variables but no dedicated ADR for config strategy
- **Recommendation**: Create ADR for 12-factor app config, secrets management, env-specific settings

### 5. **Testing Strategy and Coverage**

- **Gap**: No ADR documents testing philosophy (unit, integration, e2e, performance)
- **Recommendation**: Create ADR for testing pyramid, coverage targets, test data management

### 6. **Deployment and Release Strategy**

- **Gap**: No ADR for deployment pipelines, rollback procedures, blue-green deployments
- **Recommendation**: Create ADR for CI/CD, deployment strategies, monitoring

### 7. **Security Patterns and Threat Model**

- **Gap**: Security mentioned in ADR-021 (no hardcoded secrets) but no comprehensive security ADR
- **Recommendation**: Create ADR for OWASP Top 10, input validation, CSRF protection, rate limiting

### 8. **Caching Strategy**

- **Gap**: Performance ADRs mention optimization but no dedicated caching ADR
- **Recommendation**: Create ADR for HTTP caching, in-memory caching, CDN strategy

### 9. **API Design and Versioning**

- **Gap**: No ADR for API design principles, versioning strategy, breaking changes
- **Recommendation**: Create ADR for RESTful design, API versioning, deprecation policy

### 10. **Database Migration Strategy**

- **Gap**: No ADR for schema migrations, rollback procedures, zero-downtime deployments
- **Recommendation**: Create ADR for migration tooling, versioning, testing

---

## Go/Alpine-Specific Recommendations

### 1. Leverage Go's Strengths

- **Concurrency**: Use goroutines for parallel processing (e.g., batch queries, background jobs)
- **Static binaries**: Single binary deployment simplifies ops
- **Fast startup**: Go apps start in milliseconds (perfect for serverless/containers)
- **Low memory**: Go's GC is efficient (128MB RSS is achievable for small apps)

### 2. Alpine-Specific Optimizations

```dockerfile
# Use Alpine's package manager for minimal dependencies
FROM alpine:3.19
RUN apk add --no-cache \
    ca-certificates \
    tzdata \
    && rm -rf /var/cache/apk/*

# Use scratch for truly minimal images (if no shell needed)
FROM scratch
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=builder /build/app /app
ENTRYPOINT ["/app"]
```

### 3. Performance Monitoring

```go
// Embed Prometheus metrics
import "github.com/prometheus/client_golang/prometheus/promhttp"

func setupMetrics(r chi.Router) {
    r.Handle("/metrics", promhttp.Handler())
}

// Track response times
func metricsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        duration := time.Since(start)
        
        // Alert if exceeding budget
        if duration > MaxResponseTime {
            log.Warn("Response time exceeded budget", 
                "path", r.URL.Path, 
                "duration", duration)
        }
    })
}
```

---

## Conclusion

The Astro starter template's ADR history provides valuable lessons for Go/Alpine web apps:

1. **Performance budgets** should be defined upfront and enforced in CI
2. **Minimal tooling** reduces complexity and maintenance burden
3. **Build-time optimization** is cheaper than runtime optimization
4. **Defensive programming** prevents crashes and improves UX
5. **Documentation as code** keeps docs fresh and accurate

The identified missing ADRs (error handling, testing, security, etc.) should be created to provide comprehensive architectural guidance for future development.

---

## Next Steps

1. **Create missing ADRs** (007, 016, and thematic gaps)
2. **Adapt patterns** to Go/Alpine context (see recommendations above)
3. **Establish performance budgets** for Go apps (response time, memory, binary size)
4. **Implement validation** in CI/CD (performance tests, security scans, doc checks)
5. **Document decisions** as they're made (don't wait for "big" decisions)
