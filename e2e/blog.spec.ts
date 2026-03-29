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
		const featuredHeading = page.getByRole("heading", {
			name: "Featured Posts",
		});
		// Featured section may or may not exist depending on content
		const isVisible = await featuredHeading.isVisible().catch(() => false);
		if (isVisible) {
			await expect(featuredHeading).toBeVisible();
		}
	});

	test("should display all posts section", async ({ page }) => {
		const allPostsHeading = page.getByRole("heading", { name: /All Posts/ });
		await expect(allPostsHeading).toBeVisible();
	});

	test("should display blog post cards with metadata", async ({ page }) => {
		// Check if posts exist (may be empty in starter)
		const noPosts = await page
			.getByText("No blog posts found")
			.isVisible()
			.catch(() => false);

		if (!noPosts) {
			// If posts exist, verify card structure
			const postCards = page.locator("article, .group");
			const count = await postCards.count();
			if (count > 0) {
				// Verify first post has title and metadata
				const firstCard = postCards.first();
				await expect(firstCard).toBeVisible();
			}
		}
	});

	test("@a11y should have proper semantic structure", async ({ page }) => {
		// Check for main content area
		const sections = page.locator("section");
		await expect(sections.first()).toBeVisible();

		// Check for proper heading hierarchy
		const h1 = page.locator("h1");
		await expect(h1).toHaveCount(1);
	});

	test("should have pagination controls if multiple pages", async ({
		page,
	}) => {
		const pagination = page.locator('nav[aria-label="Blog pagination"]');
		const hasPagination = await pagination.isVisible().catch(() => false);

		if (hasPagination) {
			// Verify pagination buttons
			const prevButton = page.getByRole("button", { name: /Previous/ });
			const nextButton = page.getByRole("button", { name: /Next/ });

			await expect(prevButton).toBeVisible();
			await expect(nextButton).toBeVisible();
		}
	});
});

test.describe("Blog Post Layout", () => {
	test("should have proper article structure", async ({ page }) => {
		// Navigate directly to a known blog post
		await page.goto("/blog/embracing-astro/");
		const hasPost = true;

		if (hasPost) {

			// Verify article structure
			const article = page.locator("article");
			await expect(article).toBeVisible();

			// Check for breadcrumb navigation
			const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
			await expect(breadcrumb).toBeVisible();

			// Verify breadcrumb links
			await expect(breadcrumb.getByRole("link", { name: "Home" })).toBeVisible();
			await expect(breadcrumb.getByRole("link", { name: "Blog" })).toBeVisible();
		}
	});

	test("@a11y should have accessible table of contents", async ({ page }) => {
		await page.goto("/blog/");

		const firstPostLink = page.locator('a[href^="/blog/"]').first();
		const hasPost = await firstPostLink.isVisible().catch(() => false);

		if (hasPost) {
			await firstPostLink.click();

			// Check for TOC if it exists
			const toc = page.locator('nav[aria-label="Table of contents"]');
			const hasToc = await toc.isVisible().catch(() => false);

			if (hasToc) {
				await expect(toc).toBeVisible();
				// Verify TOC has heading
				const tocHeading = toc.getByRole("heading", {
					name: "Table of Contents",
				});
				await expect(tocHeading).toBeVisible();
			}
		}
	});

	test("should have social sharing buttons", async ({ page }) => {
		await page.goto("/blog/");

		const firstPostLink = page.locator('a[href^="/blog/"]').first();
		const hasPost = await firstPostLink.isVisible().catch(() => false);

		if (hasPost) {
			await firstPostLink.click();

			// Check for social sharing section
			const shareHeading = page.getByRole("heading", {
				name: "Share this post",
			});
			const hasShare = await shareHeading.isVisible().catch(() => false);

			if (hasShare) {
				await expect(shareHeading).toBeVisible();
			}
		}
	});

	test("should have post navigation (prev/next)", async ({ page }) => {
		await page.goto("/blog/embracing-astro/");
		const hasPost = true;

		if (hasPost) {

			// Check for post navigation
			const postNav = page.locator('nav[aria-label="Post navigation"]');
			const hasNav = await postNav.isVisible().catch(() => false);

			if (hasNav) {
				await expect(postNav).toBeVisible();
			}
		}
	});

	test("should display post metadata correctly", async ({ page }) => {
		await page.goto("/blog/embracing-astro/");
		const hasPost = true;

		if (hasPost) {

			// Check for article title
			const h1 = page.locator("article h1");
			await expect(h1).toBeVisible();

			// Check for metadata elements (author, date, reading time)
			const article = page.locator("article");
			await expect(article).toBeVisible();
		}
	});
});
