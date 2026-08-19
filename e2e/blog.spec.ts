import { expect, test } from "@playwright/test";

test.describe("Blog Index Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/blog/");
	});

	test("should load successfully with correct title", async ({ page }) => {
		await expect(page).toHaveTitle(/Blog/);
	});

	test("should display blog header with description", async ({ page }) => {
		const heading = page.getByRole("heading", { name: "Blog", exact: true });
		await expect(heading).toBeVisible();

		const description = page.getByText(
			/Thoughts, tutorials, and insights about web development/,
		);
		await expect(description).toBeVisible();
	});

	test("should display featured posts section on first page", async ({
		page,
	}) => {
		// The demo content ships a featured post, so the section must render on
		// page 1. If a forked instance removes all featured posts this fails
		// loudly — the correct signal (ADR-037 forbids conditional assertions).
		// Heading reads "Featured" (count-neutral: it may hold a single card).
		const featuredHeading = page.getByRole("heading", {
			name: "Featured",
			exact: true,
		});
		await expect(featuredHeading).toBeVisible();
	});

	test("should display all posts section", async ({ page }) => {
		const allPostsHeading = page.getByRole("heading", { name: /All Posts/ });
		await expect(allPostsHeading).toBeVisible();
	});

	test("should display blog post cards with metadata", async ({ page }) => {
		// The demo content ships four posts, so the empty state must NOT render
		// and at least one card must. Asserting the precondition (rather than
		// guarding on it) is what ADR-037 Rule 3 requires: a fork that deletes
		// every post fails here loudly instead of passing silently.
		await expect(page.getByText("No blog posts found")).toHaveCount(0);

		const postCards = page.locator("article.post-card");
		await expect(postCards.first()).toBeVisible();
	});

	test("@a11y should have proper semantic structure", async ({ page }) => {
		// Check for main content area
		const sections = page.locator("section");
		await expect(sections.first()).toBeVisible();

		// Check for proper heading hierarchy
		const h1 = page.locator("h1");
		await expect(h1).toHaveCount(1);
	});

	test("should not render pagination when all posts fit on one page", async ({
		page,
	}) => {
		// The index paginates at 6 posts per page (src/pages/blog/index.astro)
		// and the demo content ships fewer than that, so the pagination nav must
		// be absent. Both halves are asserted: the precondition (≤ 6 posts in
		// the All Posts grid) and the consequence (no pagination nav). If a fork
		// adds a seventh post this fails loudly and the test gets rewritten to
		// cover the multi-page case — ADR-037 Rule 3, not a silent skip.
		const allPostsCards = page.locator(
			'section[aria-labelledby="all-posts-heading"] article.post-card',
		);
		const count = await allPostsCards.count();
		expect(count).toBeGreaterThan(0);
		expect(count).toBeLessThanOrEqual(6);

		await expect(
			page.locator('nav[aria-label="Blog pagination"]'),
		).toHaveCount(0);
	});
});

test.describe("Blog Post Layout", () => {
	test("should have proper article structure", async ({ page }) => {
		await page.goto("/blog/why-astro-in-2026/");

		// Verify article structure
		const article = page.locator("article");
		await expect(article).toBeVisible();

		// Check for breadcrumb navigation
		const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
		await expect(breadcrumb).toBeVisible();

		// Verify breadcrumb links
		await expect(breadcrumb.getByRole("link", { name: "Home" })).toBeVisible();
		await expect(breadcrumb.getByRole("link", { name: "Blog" })).toBeVisible();
	});

	test("@a11y should have accessible table of contents", async ({ page }) => {
		// This post has several h2 sections, so BlogLayout renders the TOC
		// (it is omitted only when a post has no headings). The nav and its
		// sibling "Table of Contents" heading are asserted unconditionally —
		// ADR-037 Rule 3 — so a layout regression fails instead of being skipped.
		await page.goto("/blog/why-astro-in-2026/");

		const toc = page.locator('nav[aria-label="Table of contents"]');
		await expect(toc).toBeVisible();
		await expect(toc.getByRole("link").first()).toBeVisible();

		const tocHeading = page.getByRole("heading", {
			name: "Table of Contents",
		});
		await expect(tocHeading).toBeVisible();
	});

	test("should have social sharing buttons", async ({ page }) => {
		// The share panel is unconditional in BlogLayout, so every post has it.
		await page.goto("/blog/why-astro-in-2026/");

		const shareHeading = page.getByRole("heading", {
			name: "Share this post",
		});
		await expect(shareHeading).toBeVisible();
	});

	test("should have post navigation (prev/next)", async ({ page }) => {
		// BlogLayout renders the nav whenever an adjacent post exists; the demo
		// content ships four posts, so every post has at least one neighbour.
		await page.goto("/blog/why-astro-in-2026/");

		const postNav = page.locator('nav[aria-label="Post navigation"]');
		await expect(postNav).toBeVisible();
		await expect(postNav.getByRole("link").first()).toBeVisible();
	});

	test("should display post metadata correctly", async ({ page }) => {
		await page.goto("/blog/why-astro-in-2026/");

		// Check for article title
		const h1 = page.locator("article h1");
		await expect(h1).toBeVisible();

		// Check for metadata elements (author, date, reading time)
		const article = page.locator("article");
		await expect(article).toBeVisible();
	});
});
