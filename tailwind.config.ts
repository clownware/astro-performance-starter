import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

import tokens from "./tokens/dist/tailwind-tokens.json";

/**
 * Simple utility to transform design tokens into Tailwind format
 * Handles nested "value" properties and HSL color conversion
 */
function transformTokens<T = Record<string, unknown>>(
  tokenObj: Record<string, unknown> | undefined,
): T {
  if (!tokenObj) {
    return {} as T;
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(tokenObj)) {
    if (value && typeof value === "object") {
      if ("value" in value && typeof value.value === "string") {
        // Handle HSL colors for opacity modifier support
        if (typeof value.value === "string" && value.value.includes("%")) {
          result[key] = `hsl(${value.value} / <alpha-value>)`;
        } else {
          result[key] = value.value;
        }
      } else {
        result[key] = transformTokens(value as Record<string, unknown>);
      }
    }
  }

  return result as T;
}

const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}", "!./src/content/docs/**/*"],
  darkMode: "class",
  theme: {
    extend: {
      // Design tokens -> Tailwind colors
      // Existing palette tokens are transformed above. Add semantic aliases so
      // utilities like `text-foreground-primary` work out-of-the-box.
      colors: {
        ...transformTokens(tokens.colors),
        foreground: {
          primary: "var(--color-foreground-primary)",
          secondary: "var(--color-foreground-secondary)",
        },
        background: {
          primary: "var(--color-background-primary)",
          secondary: "var(--color-background-secondary)",
        },
        border: {
          primary: "var(--color-border-primary)",
        },
        success: {
          100: "var(--color-success-100)",
          600: "var(--color-success-600)",
          700: "var(--color-success-700)",
        },
        warning: {
          100: "var(--color-warning-100)",
          600: "var(--color-warning-600)",
          700: "var(--color-warning-700)",
        },
        error: {
          100: "var(--color-error-100)",
          600: "var(--color-error-600)",
          700: "var(--color-error-700)",
        },
      },
      spacing: transformTokens(tokens.spacing),
      fontSize: transformTokens(tokens.fontSize),
      borderRadius: transformTokens(tokens.borderRadius),
      boxShadow: transformTokens(tokens.shadow),
      transitionDuration: transformTokens(tokens.motion?.duration),
      transitionTimingFunction: transformTokens(tokens.motion?.ease),
      typography: () => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--color-foreground-secondary)",
            "--tw-prose-headings": "var(--color-foreground-primary)",
            "--tw-prose-lead": "var(--color-foreground-secondary)",
            "--tw-prose-links": "var(--color-primary-600)",
            "--tw-prose-bold": "var(--color-foreground-primary)",
            "--tw-prose-counters": "var(--color-foreground-secondary)",
            "--tw-prose-bullets": "var(--color-border-primary)",
            "--tw-prose-hr": "var(--color-border-primary)",
            "--tw-prose-quotes": "var(--color-foreground-primary)",
            "--tw-prose-quote-borders": "var(--color-border-primary)",
            "--tw-prose-captions": "var(--color-foreground-secondary)",
            "--tw-prose-code": "var(--color-foreground-primary)",
            "--tw-prose-pre-code": "var(--color-foreground-primary)",
            "--tw-prose-pre-bg": "var(--color-background-secondary)",
            "--tw-prose-th-borders": "var(--color-border-primary)",
            "--tw-prose-td-borders": "var(--color-border-primary)",
            // Add hover states for links
            "a:hover": {
              color: "var(--color-primary-700)",
            },
          },
        },
      }),
      animation: {
        "fade-in": "fade-in 0.5s ease-in-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    typography,
    // Accessibility plugin
    ({ addUtilities }) => {
      addUtilities({
        ".focus-ring": {
          "@apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2": {},
        },
        ".sr-only": {
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: "0",
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: "0",
        },
      });
    },
  ],
} satisfies Config;

export default config;
