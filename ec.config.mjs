// Expressive Code configuration.
// Lives in a separate file so the `<Code>` component (used in .astro pages,
// not just MDX) can serialize options across the build worker boundary —
// inline config containing functions like `themeCssSelector` is not
// JSON-serializable. See:
// https://expressive-code.com/reference/configuration/
export default {
  themes: ["dark-plus", "light-plus"],
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) => (theme.type === "dark" ? ".dark" : ":root:not(.dark)"),
  // Wrap long lines instead of scrolling: a scrollable <pre> without keyboard
  // access trips axe's serious scrollable-region-focusable rule, and wrapping
  // reads better on mobile anyway.
  defaultProps: {
    wrap: true,
  },
  styleOverrides: {
    // ADR-047 role token (the pre-v2 name --color-border-primary no longer
    // exists; the var resolved to nothing and the border silently fell back).
    borderColor: "hsl(var(--color-border))",
    borderWidth: "1px",
    borderRadius: "0.5rem",
  },
};
