// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';
import compress from 'astro-compress';
import { remarkInjectVersions, rehypeInjectVersions } from './scripts/remark-inject-versions.mjs';
import { remarkValidateLinks } from './scripts/remark-validate-links.mjs';
import { remarkSnippetIncludes } from './scripts/remark-snippet-includes.mjs';

export default defineConfig({
  site: 'https://example.com',
  
  integrations: [
    mdx({
      remarkPlugins: [
        // Add snippet includes plugin first (processes shortcodes before other plugins)
        [remarkSnippetIncludes, { 
          rootDir: process.cwd(),
          snippetsDir: 'docs/snippets',
          strict: true 
        }],
        // Add our version injection plugin
        [remarkInjectVersions, { rootDir: process.cwd() }],
        // Add link validation plugin
        [remarkValidateLinks, { 
          rootDir: process.cwd(),
          basePaths: ['/docs', '/src/content'],
          strict: true 
        }]
      ],
      rehypePlugins: [
        // Optional: also process HTML nodes
        [rehypeInjectVersions, { rootDir: process.cwd() }]
      ]
    }),
    tailwind(),
    sitemap(),
  ],
  
  // Also apply to regular markdown files
  markdown: {
    remarkPlugins: [
      // Add snippet includes plugin first
      [remarkSnippetIncludes, { 
        rootDir: process.cwd(),
        snippetsDir: 'docs/snippets',
        strict: true 
      }],
      [remarkInjectVersions, { rootDir: process.cwd() }],
      [remarkValidateLinks, { 
        rootDir: process.cwd(),
        basePaths: ['/docs', '/src/content'],
        strict: true 
      }]
    ],
    rehypePlugins: [
      [rehypeInjectVersions, { rootDir: process.cwd() }]
    ]
  }
});