// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import astroExpressiveCode from 'astro-expressive-code';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://chrispezza.github.io',
	base: process.env.NODE_ENV === 'production' ? '/astro-starter-template' : '/',
	integrations: [
		astroExpressiveCode(),

		starlight({
			title: 'Astro Performance Starter',
			description: 'Production-ready Astro starter template with 100/100 Lighthouse scores',
			logo: {
				src: './src/assets/logo.svg',
				replacesTitle: false,
			},
			social: [
				{
					label: 'GitHub',
					href: 'https://github.com/chrispezza/astro-starter-template',
					icon: 'github',
				},
			],
			editLink: {
				baseUrl: 'https://github.com/chrispezza/astro-starter-template/edit/master/docs/',
			},
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Overview', link: '/' },
						{ label: 'Quick Deploy', link: '/quick-track-deploy' },
						{ label: 'FAQ', link: '/faq' },
					],
				},
				{
					label: 'Implementation Guides',
					collapsed: false,
					autogenerate: { directory: 'implementation-guides' },
				},
				{
					label: 'Development',
					items: [
						{ label: 'Contributing', link: '/contributing' },
						{ label: 'Git Workflow', link: '/git-workflow' },
						{ label: 'Design Tokens', link: '/how-to-use-design-tokens' },
						{ label: 'Design System Changelog', link: '/design-system-changelog' },
					],
				},
				{
					label: 'Architecture',
					items: [
						{ label: 'GitHub Template Structure', link: '/github-template-structure' },
						{ label: 'Documentation Review Cadence', link: '/documentation-review-cadence' },
						{ label: 'Link Migration Guide', link: '/link-migration-guide' },
					],
				},
				{
					label: 'Architecture Decision Records',
					collapsed: true,
					autogenerate: { directory: 'adr' },
				},
				{
					label: 'Patterns & Snippets',
					collapsed: true,
					items: [
						{
							label: 'Patterns',
							autogenerate: { directory: 'patterns' },
						},
						{
							label: 'Code Snippets',
							autogenerate: { directory: 'snippets' },
						},
					],
				},
				{
					label: 'Tracks',
					collapsed: true,
					autogenerate: { directory: 'tracks' },
				},
				{
					label: 'AI Context',
					collapsed: true,
					autogenerate: { directory: 'ai-context' },
				},
			],
			customCss: [
				'./src/styles/custom.css',
			],
			lastUpdated: true,
			pagination: true,
			tableOfContents: {
				minHeadingLevel: 2,
				maxHeadingLevel: 4,
			},
		}),
		mdx(),
	],
	markdown: {
		remarkPlugins: [],
		rehypePlugins: [],
	},
});
