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
    } else if (typeof value === "string" || typeof value === "number") {
      // Pass-through already string/number values from preprocessed Tailwind tokens
      result[key] = value;
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
          primary: "hsl(var(--color-foreground-primary) / <alpha-value>)",
          secondary: "hsl(var(--color-foreground-secondary) / <alpha-value>)",
        },
        background: {
          primary: "hsl(var(--color-background-primary) / <alpha-value>)",
          secondary: "hsl(var(--color-background-secondary) / <alpha-value>)",
        },
        border: {
          primary: "hsl(var(--color-border-primary) / <alpha-value>)",
        },
        success: {
          100: "hsl(var(--success-100) / <alpha-value>)",
          600: "hsl(var(--success-600) / <alpha-value>)",
          700: "hsl(var(--success-700) / <alpha-value>)",
        },
        warning: {
          100: "hsl(var(--warning-100) / <alpha-value>)",
          600: "hsl(var(--warning-600) / <alpha-value>)",
          700: "hsl(var(--warning-700) / <alpha-value>)",
        },
        error: {
          100: "hsl(var(--error-100) / <alpha-value>)",
          600: "hsl(var(--error-600) / <alpha-value>)",
          700: "hsl(var(--error-700) / <alpha-value>)",
        },
      },
      spacing: transformTokens(tokens.spacing),
      fontSize: transformTokens(tokens.fontSize),
      borderRadius: transformTokens(tokens.borderRadius),
      boxShadow: transformTokens(tokens.shadow),
      transitionDuration: transformTokens(tokens.motion?.duration),
      transitionTimingFunction: transformTokens(tokens.motion?.ease),
      typography: () => ({
        // biome-ignore lint/style/useNamingConvention: Tailwind Typography plugin requires the `DEFAULT` key
        DEFAULT: {
          css: {
            "--tw-prose-body": "hsl(var(--color-foreground-secondary))",
            "--tw-prose-headings": "hsl(var(--color-foreground-primary))",
            "--tw-prose-lead": "hsl(var(--color-foreground-secondary))",
            "--tw-prose-links": "hsl(var(--color-primary-600))",
            "--tw-prose-bold": "hsl(var(--color-foreground-primary))",
            "--tw-prose-counters": "hsl(var(--color-foreground-secondary))",
            "--tw-prose-bullets": "hsl(var(--color-border-primary))",
            "--tw-prose-hr": "hsl(var(--color-border-primary))",
            "--tw-prose-quotes": "hsl(var(--color-foreground-primary))",
            "--tw-prose-quote-borders": "hsl(var(--color-border-primary))",
            "--tw-prose-captions": "hsl(var(--color-foreground-secondary))",
            "--tw-prose-code": "hsl(var(--color-foreground-primary))",
            "--tw-prose-pre-code": "hsl(var(--color-foreground-primary))",
            "--tw-prose-pre-bg": "hsl(var(--color-background-secondary))",
            "--tw-prose-th-borders": "hsl(var(--color-border-primary))",
            "--tw-prose-td-borders": "hsl(var(--color-border-primary))",
            // Add hover states for links
            "a:hover": {
              color: "hsl(var(--color-primary-700))",
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
        ".focus-visible-ring": {
          "@apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2":
            {},
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
