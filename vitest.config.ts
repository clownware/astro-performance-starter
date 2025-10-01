import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
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
    },
  },
});
