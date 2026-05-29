#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Type definitions for design tokens
interface Token {
  value: string;
  dark?: string;
}

type TokenGroup = { [key: string]: Token | TokenGroup };

interface BaseTokens {
  color?: TokenGroup;
  spacing?: TokenGroup;
  fontSize?: TokenGroup;
  borderRadius?: TokenGroup;
  shadow?: TokenGroup;
  motion?: TokenGroup;
  [key: string]: TokenGroup | undefined;
}

interface SemanticTokens {
  semantic?: TokenGroup;
}

const filename = fileURLToPath(import.meta.url);
const dirName = dirname(filename);

const tokensDir = join(dirName, "..", "..", "tokens");
const distDir = join(tokensDir, "dist");

// Ensure dist directory exists
mkdirSync(distDir, { recursive: true });

// --- Build Tailwind-specific tokens --- //
const baseTokenPath = join(tokensDir, "base.json");
const baseTokens = JSON.parse(readFileSync(baseTokenPath, "utf-8")) as BaseTokens;

// Helper: deep merge for plain objects
const deepMerge = (target: Record<string, unknown>, source: Record<string, unknown>) => {
  for (const [k, v] of Object.entries(source)) {
    if (
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      target[k] &&
      typeof target[k] === "object" &&
      !Array.isArray(target[k])
    ) {
      target[k] = deepMerge(target[k] as Record<string, unknown>, v as Record<string, unknown>);
    } else {
      target[k] = v;
    }
  }
  return target;
};

// Extract raw values from token groups (non-colors)
const extractValues = (group: TokenGroup): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(group)) {
    if (val && typeof val === "object") {
      if ("value" in val) {
        out[key] = (val as Token).value;
      } else {
        out[key] = extractValues(val as TokenGroup);
      }
    }
  }
  return out;
};

// Build color map using CSS variables for dark-mode switching
const toKebabCaseLocal = (str: string) =>
  str.replace(/([a-z0-9]|(?<=[a-z0-9]))([A-Z])/g, "$1-$2").toLowerCase();

const buildColorVars = (
  group: TokenGroup,
  path: string[] = [],
  varPrefix = "color",
): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(group)) {
    const nextPath = [...path, toKebabCaseLocal(key)];
    if (val && typeof val === "object") {
      if ("value" in val) {
        // Reference the CSS var built by the CSS generator
        const parts = varPrefix ? [varPrefix, ...nextPath] : [...nextPath];
        const varName = `--${parts.join("-")}`;
        out[key] = `hsl(var(${varName}) / <alpha-value>)`;
      } else {
        out[key] = buildColorVars(val as TokenGroup, nextPath, varPrefix);
      }
    }
  }
  return out;
};

const tailwindTokens: Record<string, unknown> = {};

// Colors -> hsl(var(--color-...)/<alpha-value>)
if (baseTokens.color) {
  tailwindTokens.colors = buildColorVars(baseTokens.color, [], "color");
}
// Others -> raw extracted values
if (baseTokens.spacing) {
  tailwindTokens.spacing = extractValues(baseTokens.spacing);
}
if (baseTokens.fontSize) {
  tailwindTokens.fontSize = extractValues(baseTokens.fontSize);
}
if (baseTokens.borderRadius) {
  tailwindTokens.borderRadius = extractValues(baseTokens.borderRadius);
}
if (baseTokens.shadow) {
  tailwindTokens.shadow = extractValues(baseTokens.shadow);
}
if (baseTokens.motion) {
  tailwindTokens.motion = extractValues(baseTokens.motion);
}

// --- Load semantic tokens early --- //
const semanticTokenPath = join(tokensDir, "semantic.json");
const semanticTokens = JSON.parse(readFileSync(semanticTokenPath, "utf-8")) as SemanticTokens;

// Function to resolve token references like {color.moonstone.100}
function resolveTokenReferences(obj: TokenGroup, context: BaseTokens): TokenGroup {
  const resolved: TokenGroup = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === "object") {
      if ("value" in value) {
        const token = value as Token;
        // Check if value contains a reference
        if (
          typeof token.value === "string" &&
          token.value.startsWith("{") &&
          token.value.endsWith("}")
        ) {
          const refPath = token.value.slice(1, -1).split(".");
          let resolvedValue: any = context;

          // Navigate through the reference path. Object.hasOwn (not `in`) rejects inherited
          // keys like __proto__/constructor/prototype, preventing prototype-pollution lookups.
          for (const part of refPath) {
            if (
              resolvedValue &&
              typeof resolvedValue === "object" &&
              Object.hasOwn(resolvedValue, part)
            ) {
              resolvedValue = resolvedValue[part];
            } else {
              resolvedValue = null;
              break;
            }
          }

          // If we found a token with a value, use it
          if (resolvedValue && typeof resolvedValue === "object" && "value" in resolvedValue) {
            resolved[key] = { value: resolvedValue.value };

            // Handle dark mode token references
            if (token.dark) {
              if (
                typeof token.dark === "string" &&
                token.dark.startsWith("{") &&
                token.dark.endsWith("}")
              ) {
                // Resolve dark mode reference
                const darkRefPath = token.dark.slice(1, -1).split(".");
                let darkResolvedValue: any = context;

                for (const part of darkRefPath) {
                  if (
                    darkResolvedValue &&
                    typeof darkResolvedValue === "object" &&
                    Object.hasOwn(darkResolvedValue, part)
                  ) {
                    darkResolvedValue = darkResolvedValue[part];
                  } else {
                    darkResolvedValue = null;
                    break;
                  }
                }

                if (
                  darkResolvedValue &&
                  typeof darkResolvedValue === "object" &&
                  "value" in darkResolvedValue
                ) {
                  (resolved[key] as Token).dark = darkResolvedValue.value;
                }
              } else {
                // Use dark value as-is if it's not a reference
                (resolved[key] as Token).dark = token.dark;
              }
            }
          } else {
            // Fallback to original if reference couldn't be resolved
            resolved[key] = value;
          }
        } else {
          resolved[key] = value;
        }
      } else {
        // Recursively resolve nested groups
        resolved[key] = resolveTokenReferences(value as TokenGroup, context);
      }
    }
  }

  return resolved;
}

// Add semantic tokens to Tailwind config
if (semanticTokens.semantic) {
  // Merge semantic color tokens into colors object
  if (!tailwindTokens.colors) {
    tailwindTokens.colors = {} as Record<string, unknown>;
  }

  // Resolve token references using base tokens as context
  const resolvedSemantic = resolveTokenReferences(semanticTokens.semantic, baseTokens);
  // Convert resolved semantic tokens into CSS var references with 'color-' prefix for consistency
  const semanticColorVars = buildColorVars(resolvedSemantic, [], "color");
  tailwindTokens.colors = deepMerge(
    tailwindTokens.colors as Record<string, unknown>,
    semanticColorVars as Record<string, unknown>,
  );
}

const tailwindTokenPath = join(distDir, "tailwind-tokens.json");
writeFileSync(tailwindTokenPath, JSON.stringify(tailwindTokens, null, 2));
console.log(`✅ Built Tailwind tokens -> ${tailwindTokenPath}`);

// --- Build CSS variables (light/dark) --- //

const toKebabCase = (str: string) =>
  str.replace(/([a-z0-9]|(?<=[a-z0-9]))([A-Z])/g, "$1-$2").toLowerCase();

function flattenTokensRecursive(obj: TokenGroup, prefix: string[], acc: Record<string, string>) {
  for (const [key, value] of Object.entries(obj)) {
    const newPrefix = [...prefix, toKebabCase(key)];
    if (value && typeof value === "object" && !("value" in value)) {
      const nestedTokens = flattenTokens(value as TokenGroup, newPrefix);
      for (const [nestedKey, nestedValue] of Object.entries(nestedTokens)) {
        acc[nestedKey] = nestedValue;
      }
    } else if (value && typeof value === "object" && "value" in value) {
      const token = value as Token;
      const varName = `--${newPrefix.join("-")}`;
      acc[varName] = token.value;
      if (token.dark) {
        acc[`${varName}|dark`] = token.dark;
      }
    }
  }
}

const flattenTokens = (obj: TokenGroup, prefix: string[] = []): Record<string, string> => {
  const acc: Record<string, string> = {};
  flattenTokensRecursive(obj, prefix, acc);
  return acc;
};

const generateCssVariables = (tokens: Record<string, string>): string => {
  let lightCss = ":root {\n";
  let darkCss = ".dark {\n";

  for (const [name, value] of Object.entries(tokens)) {
    if (name.endsWith("|dark")) {
      continue;
    }
    lightCss += `  ${name}: ${value};\n`;
  }

  if (tokens) {
    for (const [name, value] of Object.entries(tokens)) {
      if (name.endsWith("|dark")) {
        const lightName = name.replace("|dark", "");
        darkCss += `  ${lightName}: ${value};\n`;
      }
    }
  }

  lightCss += "}\n";
  if (darkCss !== ".dark {\n") {
    darkCss += "}\n";
  } else {
    darkCss = ""; // Ensure darkCss is empty if no dark tokens are found
  }

  return lightCss + darkCss;
};

// Resolve semantic tokens before flattening for CSS
const resolvedSemanticForCss = resolveTokenReferences(semanticTokens.semantic ?? {}, baseTokens);

const allVars = {
  ...flattenTokens(baseTokens as TokenGroup),
  // Add 'color-' prefix to semantic tokens for consistent naming convention
  ...flattenTokens(resolvedSemanticForCss, ["color"]),
};

const cssTokenPath = join(distDir, "tokens.css");
writeFileSync(cssTokenPath, generateCssVariables(allVars));
console.log(`✅ Built CSS variables -> ${cssTokenPath}`);
