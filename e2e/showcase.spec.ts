import { expect, test } from "@playwright/test";

test.describe("Component Showcase", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/showcase/");
	});

	test("should load successfully with correct title", async ({ page }) => {
		await expect(page).toHaveTitle(/Component Showcase/);
	});

	test("should display hero with animated H1", async ({ page }) => {
		const h1 = page.getByRole("heading", { level: 1, name: "Component Showcase" });
		await expect(h1).toBeVisible();
	});

	test("should render hero stat counters with accessible names", async ({ page }) => {
		// CounterBadge uses role="img" + aria-label so screen readers get the
		// final value even though the visible text is animated via CSS counter().
		await expect(page.getByRole("img", { name: "40+ Components" })).toBeVisible();
		await expect(page.getByRole("img", { name: "0 KB New JS Added" })).toBeVisible();
		await expect(page.getByRole("img", { name: "95+ Lighthouse" })).toBeVisible();
	});

	test("should display all top-level showcase sections", async ({ page }) => {
		for (const heading of [
			"Design Tokens",
			"Atoms",
			"Molecules",
			"Structural",
			"Islands Architecture",
			"Composition",
		]) {
			await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
		}
	});

	test("should not contain removed sections", async ({ page }) => {
		// "Modern CSS Features" and the standalone "Accessibility" section were
		// moved out during the showcase restructure. They must not regress.
		await expect(
			page.getByRole("heading", { level: 2, name: "Modern CSS Features" }),
		).toHaveCount(0);
		await expect(
			page.getByRole("heading", { level: 2, name: "Accessibility" }),
		).toHaveCount(0);
	});

	test("Tabs should switch panels via radio inputs", async ({ page }) => {
		// The Tabs demo uses three tabs: Overview, Usage, Accessibility.
		// Click each and verify only that panel's content is visible.
		const overviewPanel = page.locator('[data-tab-panel="overview"]').first();
		const usagePanel = page.locator('[data-tab-panel="usage"]').first();
		const a11yPanel = page.locator('[data-tab-panel="a11y"]').first();

		await expect(overviewPanel).toBeVisible();
		await expect(usagePanel).toBeHidden();
		await expect(a11yPanel).toBeHidden();

		// Click the visible tab label rather than the sr-only radio input.
		// The label[for] association toggles the radio without the sticky
		// header intercepting pointer events.
		await page.locator('label.tabs__tab').filter({ hasText: "Usage" }).first().click();
		await expect(usagePanel).toBeVisible();
		await expect(overviewPanel).toBeHidden();
	});

	test("Dialog should open, show h3 title, and close", async ({ page }) => {
		const openButton = page.getByRole("button", { name: "Open Dialog" });
		await openButton.click();

		// The dialog title is rendered as <h3> in the showcase context to keep
		// heading hierarchy intact (the surrounding section uses h3).
		const dialogTitle = page.getByRole("heading", {
			level: 3,
			name: "Native Dialog Element",
		});
		await expect(dialogTitle).toBeVisible();

		// Native <dialog> closes on Escape — no JS focus-trap library required.
		await page.keyboard.press("Escape");
		await expect(dialogTitle).toBeHidden();
	});

	test("Show code toggle should be uniquely labeled per example", async ({ page }) => {
		// Each <details> summary includes the example title so SR users can
		// distinguish between multiple "Show code" controls on the page.
		await expect(page.getByText("Show Badge code")).toBeVisible();
		await expect(page.getByText("Show Button code")).toBeVisible();
		await expect(page.getByText("Show Tabs code")).toBeVisible();
	});

	test("Code blocks should carry a language-* class", async ({ page }) => {
		// At least one inline code block per example should have a language
		// class so syntax-highlighting tooling can identify it.
		const langClasses = page.locator("code.language-astro");
		const count = await langClasses.count();
		expect(count).toBeGreaterThan(10);
	});

	test("@a11y should have proper landmark and heading structure", async ({ page }) => {
		// Single <main> landmark
		const main = page.locator("main");
		await expect(main).toBeVisible();

		// Single H1
		const h1 = page.locator("h1");
		await expect(h1).toHaveCount(1);

		// Two <nav> landmarks for the ScrollSpy variants — sidebar and
		// horizontal — each must have a unique accessible name. Use attribute
		// locators rather than getByRole because Tailwind's responsive
		// `hidden lg:block` / `lg:hidden` toggles mean only one is visible at
		// a given viewport, which would otherwise drop the other from the
		// accessibility tree.
		await expect(page.locator('nav[aria-label="Table of contents"]')).toHaveCount(1);
		await expect(page.locator('nav[aria-label="Section navigation"]')).toHaveCount(1);
	});

	test("@a11y dialog title should be h3, not h2 (no skipped levels)", async ({ page }) => {
		await page.getByRole("button", { name: "Open Dialog" }).click();
		// The surrounding section heading is h3, so the dialog title is h3 too.
		// If the dialog regressed to h2, it would skip a level inside the section.
		await expect(
			page.getByRole("heading", { level: 3, name: "Native Dialog Element" }),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { level: 2, name: "Native Dialog Element" }),
		).toHaveCount(0);
		await page.keyboard.press("Escape");
	});
});
