import { resolve } from "node:path";
import { getViteConfig } from "astro/config";

// Use Astro's vite config so vitest can transform .astro components for
// container-API based unit tests (see src/components/**/__tests__).
export default getViteConfig({
  test: {
    environment: "jsdom",
    globals: true,
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      // Scope coverage to pure-logic modules in scope for the ADR-023 unit-test
      // target. Components (.astro) and build scripts run through Astro/Node
      // runtimes that v8 instrumentation handles poorly — they're tested via
      // Playwright (e2e/a11y) and exercised by `pnpm build`, not here.
      include: ["src/utils/**/*.ts"],
      exclude: ["**/__tests__/**", "**/__mocks__/**", "**/*.test.ts", "**/*.spec.ts", "**/*.d.ts"],
      // Ratcheted from 80/75/70 with utils measured at 96.9/100/99.35 (#247) —
      // floors hold a safety margin, not the current high-water mark.
      thresholds: {
        lines: 90,
        functions: 95,
        branches: 90,
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@layouts": "/src/layouts",
      "@utils": "/src/utils",
      "@styles": "/src/styles",
      "@types": "/src/types",
      "@content": "/src/content",
      "@assets": "/src/assets",
      // astro:content is a virtual module — stub it so utilities that import
      // from it (e.g. src/utils/blog.ts) can be unit-tested without Astro's runtime.
      "astro:content": resolve(__dirname, "src/__mocks__/astro-content.ts"),
    },
  },
});
