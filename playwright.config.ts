import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for E2E testing
 * @see https://playwright.dev/docs/test-configuration
 */

// Deliberately not Astro's default 4321. Every Astro project on the machine
// competes for that port, and `reuseExistingServer` adopts whatever answers on
// it — so a sibling project's server gets tested instead of this one, silently.
// ADR-063 records two such incidents; a third happened on 2026-09-08. Moving off
// the contended port removes the common case; `e2e/global-setup.ts` catches the
// rest by asserting the server actually serves this app.
const PORT = Number(process.env.E2E_PORT ?? 4351);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  // No `webServer` block. `astro preview` detaches, so Playwright's launcher
  // exits immediately and either aborts the run ("Process from config.webServer
  // exited early") or races the detached server into binding — and, never
  // having owned the process, Playwright could not stop it either, so every run
  // leaked a daemon for the next one to adopt. e2e/global-setup.ts owns start,
  // readiness, identity and shutdown instead.
});
