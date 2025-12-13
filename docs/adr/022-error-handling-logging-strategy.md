---
title: 'ADR-022: Error Handling and Logging Strategy'
lastUpdated: 2025-11-15T00:00:00.000Z
description: Defines error handling patterns, structured logging, and observability practices
tableOfContents: true
pagefind: true
---

# ADR-022: Error Handling and Logging Strategy

## Status

Proposed

## Context

The Astro starter template currently lacks a comprehensive error handling and logging strategy. As the application grows, we need consistent patterns for:

- **Error handling**: How to catch, log, and recover from errors
- **Structured logging**: What to log, at what level, and in what format
- **Observability**: How to monitor application health and debug issues
- **Security**: Ensuring sensitive data isn't logged

This becomes especially critical for:

- Dynamic routes that may encounter missing content
- Form submissions that may fail
- Build-time operations (token generation, link validation)
- Production deployments where debugging is harder

## Decision Drivers

- **Debuggability**: Developers need clear error messages to diagnose issues
- **Security**: Never log sensitive data (tokens, passwords, PII)
- **Performance**: Logging should have minimal overhead
- **Observability**: Errors should be trackable in production
- **User Experience**: Users should see helpful error messages, not stack traces

## Considered Options

### Option 1: Console.log Only (Current State)

**Description**: Ad-hoc `console.log()` and `console.error()` statements

**Pros**:

- Simple, no dependencies
- Works in browser and Node.js

**Cons**:

- No structure, hard to parse
- No log levels (debug vs error)
- No context (timestamps, request IDs)
- Can't filter or search logs

### Option 2: Structured Logging with Pino

**Description**: Use Pino for structured JSON logging

**Pros**:

- Fast (5x faster than Winston)
- Structured JSON output
- Log levels (trace, debug, info, warn, error, fatal)
- Child loggers with context
- Production-ready

**Cons**:

- Additional dependency
- Requires configuration
- JSON logs less readable in development

### Option 3: Custom Logger Wrapper

**Description**: Build a thin wrapper around console with structure

**Pros**:

- No dependencies
- Full control over format
- Can add structure gradually

**Cons**:

- Reinventing the wheel
- Missing features (log rotation, transports)
- Maintenance burden

## Decision

We will implement **Option 2 (Structured Logging with Pino)** for build scripts and server-side code, with the following patterns:

### 1. Error Handling Patterns

```typescript
// ✅ Graceful error handling in dynamic routes
export async function getStaticPaths() {
  try {
    const posts = await getCollection('blog');
    return posts.map(post => ({
      params: { slug: post.slug },
      props: { post },
    }));
  } catch (error) {
    logger.error({ error, context: 'getStaticPaths' }, 'Failed to load blog posts');
    // Fail build - don't deploy broken site
    throw error;
  }
}

// ✅ Defensive error handling in pages
const { slug } = Astro.params;
const post = await getPost(slug);

if (!post) {
  logger.warn({ slug }, 'Post not found, redirecting to 404');
  return Astro.redirect('/404', 303);
}
```

### 2. Structured Logging

```typescript
// scripts/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'HH:MM:ss',
    },
  },
});

// Usage
logger.info({ userId: 123, action: 'login' }, 'User logged in');
logger.error({ error, context: 'database' }, 'Database connection failed');
```

### 3. Security: Redact Sensitive Data

```typescript
// ✅ Redact sensitive fields
const logger = pino({
  redact: {
    paths: [
      'password',
      'token',
      'apiKey',
      'email',
      '*.password',
      '*.token',
      'req.headers.authorization',
    ],
    censor: '[REDACTED]',
  },
});

// Example: email is redacted
logger.info({ email: 'user@example.com', action: 'signup' }, 'User signed up');
// Output: { email: '[REDACTED]', action: 'signup', msg: 'User signed up' }
```

### 4. Build-Time Logging

```typescript
// scripts/build-tokens.ts
import { logger } from './logger';

export async function buildTokens() {
  logger.info('Starting token build');
  
  try {
    const tokens = await loadTokens();
    logger.debug({ tokenCount: tokens.length }, 'Loaded tokens');
    
    const validated = validateContrast(tokens);
    logger.info({ validated: validated.length }, 'Validated token contrast');
    
    await writeTokens(validated);
    logger.info('Token build complete');
  } catch (error) {
    logger.error({ error }, 'Token build failed');
    process.exit(1);
  }
}
```

### 5. Client-Side Error Handling

```typescript
// For client-side errors (Preact islands, forms)
window.addEventListener('error', (event) => {
  // Send to error tracking service (Sentry, LogRocket, etc.)
  console.error('Unhandled error:', event.error);
  
  // Don't log in production console (security)
  if (import.meta.env.PROD) {
    event.preventDefault();
  }
});

// Form error handling
async function handleSubmit(event: Event) {
  event.preventDefault();
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: new FormData(event.target as HTMLFormElement),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Success
    window.location.href = '/thank-you';
  } catch (error) {
    // Show user-friendly error
    showError('Failed to send message. Please try again.');
    
    // Log for debugging (only in dev)
    if (import.meta.env.DEV) {
      console.error('Form submission failed:', error);
    }
  }
}
```

## Consequences

### Positive

- **Better debugging**: Structured logs are searchable and filterable
- **Security**: Sensitive data is automatically redacted
- **Observability**: Can integrate with log aggregation tools (Datadog, Splunk)
- **Performance**: Pino is fast (minimal overhead)
- **Consistency**: All errors logged in same format

### Negative

- **Dependency**: Adds Pino and pino-pretty to devDependencies
- **Learning curve**: Team needs to learn structured logging
- **JSON logs**: Less readable in development (mitigated by pino-pretty)

### Neutral

- **Build size**: No impact (logging is build-time only)
- **Runtime**: No client-side logging library (uses native console)

## Validation

- **Build logs**: Check that token build, link validation use structured logging
- **Error scenarios**: Test 404 handling, form errors, missing content
- **Security**: Verify sensitive data is redacted in logs
- **Performance**: Ensure logging doesn't slow down builds

## Implementation Checklist

- [ ] Install Pino and pino-pretty
- [ ] Create `scripts/logger.ts` with redaction config
- [ ] Update `scripts/build-tokens.ts` to use logger
- [ ] Update `scripts/check-review-dates.mjs` to use logger
- [ ] Add error handling to dynamic routes (`[slug].astro`)
- [ ] Document logging patterns in CONTRIBUTING.md
- [ ] Add log level configuration to `.env.example`

## References

- [Pino Documentation](https://getpino.io/)
- [Structured Logging Best Practices](https://www.thoughtworks.com/insights/blog/structured-logging)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

## Related ADRs

- ADR-011: Dynamic Route Error Handling (implements graceful degradation)
- ADR-021: Contact Form Progressive Enhancement (form error handling)

---

**Date**: 2025-11-15  
**Participants**: Development Team  
**Outcome**: Proposed
