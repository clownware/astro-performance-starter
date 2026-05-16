// Test fixtures for design-token data (ADR-023 §5).
// Shapes match the output of pnpm run tokens:build (style-dictionary).

export const mockColorTokens = {
  foreground: {
    primary: { value: "#0f172a", type: "color" },
    secondary: { value: "#475569", type: "color" },
  },
  background: {
    primary: { value: "#ffffff", type: "color" },
    secondary: { value: "#f1f5f9", type: "color" },
  },
  border: {
    primary: { value: "#cbd5e1", type: "color" },
  },
} as const;

export const mockContrastPair = {
  foreground: "#0f172a",
  background: "#ffffff",
  ratio: 17.74,
  passes: { aaNormal: true, aaLarge: true, aaaNormal: true, aaaLarge: true },
} as const;

export const lowContrastPair = {
  foreground: "#cccccc",
  background: "#ffffff",
  ratio: 1.61,
  passes: { aaNormal: false, aaLarge: false, aaaNormal: false, aaaLarge: false },
} as const;
