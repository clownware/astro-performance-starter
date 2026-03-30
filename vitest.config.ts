import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      thresholds: {
        lines: 80,
        functions: 75,
        branches: 70,
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
