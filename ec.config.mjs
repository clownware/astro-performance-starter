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
  styleOverrides: {
    borderColor: "hsl(var(--color-border-primary))",
    borderWidth: "1px",
    borderRadius: "0.5rem",
  },
};
