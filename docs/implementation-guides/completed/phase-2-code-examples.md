---
title: Phase 2 - Code Examples  
lastUpdated: true
description: >-
  Code examples for Phase 2
tableOfContents: true
pagefind: true
---

## Code Examples

### Design Tokens Structure

```json
// tokens/base.json
{
  "color": {
    "gray": {
      "50": { "value": "210 40% 98%" },
      "100": { "value": "210 40% 96%" },
      "200": { "value": "214 32% 91%" },
      "300": { "value": "213 27% 84%" },
      "400": { "value": "215 20% 65%" },
      "500": { "value": "215 16% 47%" },
      "600": { "value": "215 19% 35%" },
      "700": { "value": "214 24% 26%" },
      "800": { "value": "217 33% 17%" },
      "900": { "value": "218 39% 11%" },
      "950": { "value": "220 45% 6%" }
    },
    "primary": {
      "50": { "value": "210 100% 97%" },
      "100": { "value": "210 100% 94%" },
      "200": { "value": "210 100% 86%" },
      "300": { "value": "210 100% 75%" },
      "400": { "value": "210 100% 60%" },
      "500": { "value": "210 100% 48%" },
      "600": { "value": "210 100% 40%" },
      "700": { "value": "210 100% 32%" },
      "800": { "value": "210 100% 27%" },
      "900": { "value": "210 100% 23%" },
      "950": { "value": "210 100% 14%" }
    }
  },
  "spacing": {
    "0": { "value": "0" },
    "1": { "value": "0.25rem" },
    "2": { "value": "0.5rem" },
    "3": { "value": "0.75rem" },
    "4": { "value": "1rem" },
    "5": { "value": "1.25rem" },
    "6": { "value": "1.5rem" },
    "8": { "value": "2rem" },
    "10": { "value": "2.5rem" },
    "12": { "value": "3rem" },
    "16": { "value": "4rem" },
    "20": { "value": "5rem" },
    "24": { "value": "6rem" }
  },
  "fontSize": {
    "xs": { 
      "value": "0.75rem",
      "lineHeight": "1rem" 
    },
    "sm": { 
      "value": "0.875rem",
      "lineHeight": "1.25rem" 
    },
    "base": { 
      "value": "1rem",
      "lineHeight": "1.5rem" 
    },
    "lg": { 
      "value": "1.125rem",
      "lineHeight": "1.75rem" 
    },
    "xl": { 
      "value": "1.25rem",
      "lineHeight": "1.75rem" 
    },
    "2xl": { 
      "value": "1.5rem",
      "lineHeight": "2rem" 
    },
    "3xl": { 
      "value": "1.875rem",
      "lineHeight": "2.25rem" 
    },
    "4xl": { 
      "value": "2.25rem",
      "lineHeight": "2.5rem" 
    }
  },
  "borderRadius": {
    "none": { "value": "0" },
    "sm": { "value": "0.125rem" },
    "base": { "value": "0.25rem" },
    "md": { "value": "0.375rem" },
    "lg": { "value": "0.5rem" },
    "xl": { "value": "0.75rem" },
    "2xl": { "value": "1rem" },
    "3xl": { "value": "1.5rem" },
    "full": { "value": "9999px" }
  },
  "motion": {
    "duration": {
      "base": { "value": "250ms" },
      "fast": { "value": "150ms" },
      "slow": { "value": "400ms" }
    },
    "ease": {
      "in-out": { "value": "cubic-bezier(0.4, 0, 0.2, 1)" },
      "in": { "value": "cubic-bezier(0.4, 0, 1, 1)" },
      "out": { "value": "cubic-bezier(0, 0, 0.2, 1)" }
    }
  }
}
```

### Semantic Tokens

```json
// tokens/semantic.json
{
  "semantic": {
    "background": {
      "default": { 
        "value": "{color.gray.50}",
        "dark": "{color.gray.950}"
      },
      "subtle": {
        "value": "{color.gray.100}",
        "dark": "{color.gray.900}"
      },
      "muted": {
        "value": "{color.gray.200}",
        "dark": "{color.gray.800}"
      }
    },
    "foreground": {
      "default": {
        "value": "{color.gray.950}",
        "dark": "{color.gray.50}"
      },
      "muted": {
        "value": "{color.gray.600}",
        "dark": "{color.gray.400}"
      },
      "subtle": {
        "value": "{color.gray.400}",
        "dark": "{color.gray.600}"
      }
    },
    "border": {
      "default": {
        "value": "{color.gray.200}",
        "dark": "{color.gray.800}"
      },
      "strong": {
        "value": "{color.gray.300}",
        "dark": "{color.gray.700}"
      }
    },
    "focus": {
      "ring-3": {
        "value": "{color.primary.500}",
        "dark": "{color.primary.400}"
      }
    }
  }
}
```

### Tailwind CSS Considerations

Tailwind CSS is now stable and provides significant improvements over v3, including better performance, enhanced design token integration, and improved developer experience.

**Key v4.2.2 Benefits:**

- **Better Performance**: Faster build times and smaller CSS output
- **Enhanced Design Tokens**: Native CSS variables support
- **Improved DX**: Better IDE support and error messages
- **Migration Path**: Clear upgrade path from v3 configurations

**Current Implementation:**
The project uses `tailwindcss: "^4.2.2"` which ensures you get the latest stable v4 patches while maintaining compatibility.

### Image Optimization and Future Scalability

**Current Approach:**
The project currently leverages Astro's built-in `<Image>` component for image optimization. This component, often paired with the Sharp.js library under the hood (as per default Astro configurations), handles tasks like resizing, format conversion (e.g., to AVIF, WebP), and generating responsive `srcset` attributes. This is generally sufficient for optimal performance and image handling at the current scale.

**Future Consideration: Image CDN Fallback/Enhancement**
While the built-in solution is robust, if the project experiences a significant spike in traffic, or if the requirements for delivering numerous device-specific image variants become more complex, integrating a dedicated image CDN should be considered.

Services like **Cloudflare Images** (or similar offerings like Cloudinary, Imgix) provide benefits such as:

- **Real-time Resizing and Optimization**: Images can be transformed on-the-fly based on request parameters or device characteristics, reducing the need to pre-generate all variants.
- **Global CDN Delivery**: Faster image delivery worldwide.
- **Advanced Features**: Watermarking, format negotiation, and more sophisticated art direction capabilities.

This is not an immediate requirement but a potential future enhancement to keep in mind for scalability and advanced image manipulation needs. The decision to integrate such a service would involve cost considerations and a re-evaluation of the image delivery pipeline.

### Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import tokens from './tokens/dist/tailwind-tokens.json';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: tokens.colors,
      spacing: tokens.spacing,
      fontSize: tokens.fontSize,
      borderRadius: tokens.borderRadius,
      transitionDuration: tokens.motion.duration,
      transitionTimingFunction: tokens.motion.ease,
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'base': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [
    // Accessibility plugin
    function({ addUtilities }) {
      addUtilities({
        '.focus-ring': {
          '@apply focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:ring-offset-2': {},
        },
        '.focus-visible-ring': {
          '@apply focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2': {},
        },
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: '0',
        },
      });
    },
  ],
} satisfies Config;
```

### CSS Architecture

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Base colors */
    --color-gray-50: 210 40% 98%;
    --color-gray-100: 210 40% 96%;
    /* ... rest of colors */
    
    /* Semantic tokens */
    --background: var(--color-gray-50);
    --foreground: var(--color-gray-950);
    
    /* Motion tokens */
    --transition-base: 150ms ease-in-out;
    --transition-slow: 300ms ease-in-out;
    --transition-bounce: 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  :root.dark {
    --background: var(--color-gray-950);
    --foreground: var(--color-gray-50);
  }
  
  /* Reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  
  /* Focus visible polyfill */
  .focus-visible {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }
  
  /* Base typography */
  html {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Color scheme */
  html {
    color-scheme: light;
  }
  
  html.dark {
    color-scheme: dark;
  }
}

@layer utilities {
  /* Text balance for headings */
  .text-balance {
    text-wrap: balance;
  }
  
  /* Fluid typography (optional) */
  .fluid-text-sm {
    font-size: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
  }
  
  .fluid-text-base {
    font-size: clamp(1rem, 0.925rem + 0.25vw, 1.125rem);
  }
  
  .fluid-text-lg {
    font-size: clamp(1.125rem, 1rem + 0.5vw, 1.5rem);
  }
}
```

### Token Build Script

```typescript
// scripts/build-tokens.ts
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface TokenValue {
  value: string;
  dark?: string;
  lineHeight?: string;
}

interface TokenGroup {
  [key: string]: TokenValue | TokenGroup;
}

function isTokenValue(obj: any): obj is TokenValue {
  return obj && typeof obj.value === 'string';
}

function processTokens(tokens: TokenGroup, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(tokens)) {
    const tokenKey = prefix ? `${prefix}-${key}` : key;
    
    if (isTokenValue(value)) {
      result[tokenKey] = value.value;
    } else {
      Object.assign(result, processTokens(value as TokenGroup, tokenKey));
    }
  }
  
  return result;
}

// Read token files
const baseTokens = JSON.parse(readFileSync(join('tokens', 'base.json'), 'utf-8'));
const semanticTokens = JSON.parse(readFileSync(join('tokens', 'semantic.json'), 'utf-8'));

// Process for Tailwind
const tailwindTokens = {
  colors: processTokens(baseTokens.color),
  spacing: processTokens(baseTokens.spacing),
  fontSize: Object.entries(baseTokens.fontSize).reduce((acc, [key, value]: [string, TokenValue]) => {
    acc[key] = [value.value, { lineHeight: value.lineHeight || '1.5' }];
    return acc;
  }, {} as Record<string, any>),
  borderRadius: processTokens(baseTokens.borderRadius),
};

// Write Tailwind tokens
writeFileSync(
  join('tokens', 'dist', 'tailwind-tokens.json'),
  JSON.stringify(tailwindTokens, null, 2)
);

// Generate CSS variables
function generateCSSVariables(tokens: TokenGroup, prefix = ''): string[] {
  const lines: string[] = [];
  
  for (const [key, value] of Object.entries(tokens)) {
    const varName = prefix ? `--${prefix}-${key}` : `--${key}`;
    
    if (isTokenValue(value)) {
      lines.push(`  ${varName}: ${value.value};`);
    } else {
      lines.push(...generateCSSVariables(value as TokenGroup, prefix ? `${prefix}-${key}` : key));
    }
  }
  
  return lines;
}

// Generate CSS file
const cssContent = `/* Auto-generated from design tokens */
:root {
${generateCSSVariables(baseTokens).join('\n')}
}

/* Dark mode overrides */
:root.dark {
${generateCSSVariables(semanticTokens.semantic)
  .filter(line => line.includes('dark'))
  .join('\n')}
}`;

writeFileSync(join('tokens', 'dist', 'tokens.css'), cssContent);

console.log('✅ Design tokens built successfully');
```

### Accessibility Utilities

```astro


***


// src/components/a11y/VisuallyHidden.astro
export interface Props {
  as?: keyof HTMLElementTagNameMap;
  class?: string;
}

const { as: Tag = 'span', class: className } = Astro.props;


***



<Tag class:list={['sr-only', className]}>
  <slot />
</Tag>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: 'rect(0, 0, 0, 0)';
    white-space: 'nowrap';
    border-width: 0;
  }
</style>
```

### WCAG Contrast Validation

```typescript
// scripts/validate-contrast.ts
interface RGB {
  r: number;
  g: number;
  b: number;
}

function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function getLuminance(rgb: RGB): number {
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(rgb1: RGB, rgb2: RGB): number {
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Validate key color combinations
const validateContrast = () => {
  // Import semantic tokens
  const semanticTokens = JSON.parse(
    readFileSync(join('tokens', 'semantic.json'), 'utf-8')
  );
  
  // Define all semantic color pairs to check
  const colorPairs = [
    // Text on backgrounds
    {
      name: 'Default text on default background',
      fg: 'foreground.default',
      bg: 'background.default',
      required: 4.5, // WCAG AA for normal text
    },
    {
      name: 'Muted text on default background',
      fg: 'foreground.muted',
      bg: 'background.default',
      required: 4.5,
    },
    {
      name: 'Subtle text on default background',
      fg: 'foreground.subtle',
      bg: 'background.default',
      required: 3.0, // WCAG AA for large text
    },
    // Backgrounds variations
    {
      name: 'Default text on subtle background',
      fg: 'foreground.default',
      bg: 'background.subtle',
      required: 4.5,
    },
    {
      name: 'Default text on muted background',
      fg: 'foreground.default',
      bg: 'background.muted',
      required: 4.5,
    },
    // Interactive elements
    {
      name: 'Primary on white',
      fg: { h: 210, s: 100, l: 48 }, // primary-500
      bg: { r: 255, g: 255, b: 255 },
      required: 3.0, // For large text/buttons
    },
    {
      name: 'Primary on default background',
      fg: { h: 210, s: 100, l: 48 }, // primary-500
      bg: 'background.default',
      required: 3.0,
    },
  ];
  
  console.log('🎨 Validating color contrast for all semantic pairs...\n');
  
  let allPassed = true;
  const results = [];
  
  colorPairs.forEach(({ name, fg, bg, required }) => {
    // Resolve color values from tokens if needed
    const fgColor = typeof fg === 'string' ? resolveTokenValue(fg, semanticTokens) : fg;
    const bgColor = typeof bg === 'string' ? resolveTokenValue(bg, semanticTokens) : bg;
    
    // Convert to RGB
    const fgRgb = 'h' in fgColor ? hslToRgb(fgColor.h, fgColor.s, fgColor.l) : fgColor;
    const bgRgb = 'h' in bgColor ? hslToRgb(bgColor.h, bgColor.s, bgColor.l) : bgColor;
    
    const ratio = getContrastRatio(fgRgb, bgRgb);
    const passes = ratio >= required;
    
    if (!passes) allPassed = false;
    
    results.push({
      name,
      ratio: ratio.toFixed(2),
      required,
      passes,
    });
    
    console.log(
      `${passes ? '✅' : '❌'} ${name}: ${ratio.toFixed(2)}:1 (requires ${required}:1)`
    );
  });
  
  // Also check dark mode
  console.log('\n🌙 Checking dark mode contrast...\n');
  
  colorPairs.forEach(({ name, fg, bg, required }) => {
    // Get dark mode values
    const fgColor = typeof fg === 'string' ? resolveTokenValue(fg, semanticTokens, true) : fg;
    const bgColor = typeof bg === 'string' ? resolveTokenValue(bg, semanticTokens, true) : bg;
    
    const fgRgb = 'h' in fgColor ? hslToRgb(fgColor.h, fgColor.s, fgColor.l) : fgColor;
    const bgRgb = 'h' in bgColor ? hslToRgb(bgColor.h, bgColor.s, bgColor.l) : bgColor;
    
    const ratio = getContrastRatio(fgRgb, bgRgb);
    const passes = ratio >= required;
    
    if (!passes) allPassed = false;
    
    console.log(
      `${passes ? '✅' : '❌'} [Dark] ${name}: ${ratio.toFixed(2)}:1 (requires ${required}:1)`
    );
  });
  
  // Summary
  console.log('\n📊 Summary:');
  console.log(`Total pairs checked: ${colorPairs.length * 2} (light + dark)`);
  console.log(`Result: ${allPassed ? '✅ All pairs pass WCAG AA' : '❌ Some pairs fail WCAG AA'}`);
  
  if (!allPassed) {
    process.exit(1);
  }
};

// Helper to resolve token values
function resolveTokenValue(path: string, tokens: any, dark = false): any {
  const parts = path.split('.');
  let value = tokens;
  
  for (const part of parts) {
    value = value[part];
    if (!value) throw new Error(`Token not found: ${path}`);
  }
  
  // Check for dark mode value
  if (dark && value.dark) {
    // Parse the token reference (e.g., "{color.gray.950}")
    const darkPath = value.dark.replace(/[{}]/g, '');
    return resolveTokenValue(darkPath, tokens);
  }
  
  // Parse HSL values
  const hslMatch = value.value.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
  if (hslMatch) {
    return {
      h: parseInt(hslMatch[1]),
      s: parseInt(hslMatch[2]),
      l: parseInt(hslMatch[3]),
    };
  }
  
  throw new Error(`Could not parse color value: ${value.value}`);
}

validateContrast();
```

### Dark Mode Implementation

```astro


***


// src/components/ThemeToggle.astro


***



<button
  id="theme-toggle"
  type="button"
  class="focus-visible-ring rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
  aria-label="Toggle dark mode"
>
  <svg class="h-5 w-5 dark:hidden" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
  </svg>
  <svg class="hidden h-5 w-5 dark:block" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.706-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path>
  </svg>
</button>

<script>
  // Theme toggle logic
  const theme = (() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  })();

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }

  window.localStorage.setItem('theme', theme);

  const toggle = document.getElementById('theme-toggle');
  toggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
</script>
```
