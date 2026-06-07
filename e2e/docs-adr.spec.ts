import { expect, test } from "@playwright/test";

test.describe("ADR routes", () => {
	test("index page lists ADRs", async ({ page }) => {
		await page.goto("/docs/adr/");

		const h1 = page.getByRole("heading", {
			name: "Architecture Decision Records",
			level: 1,
		});
		await expect(h1).toBeVisible();

		// At least one ADR link should be present. Locating by the
		// number-prefixed label ensures we're seeing real entries, not
		// chrome.
		const list = page.getByRole("list", { name: "All ADRs" });
		await expect(list).toBeVisible();

		const firstItem = list.locator("li").first();
		await expect(firstItem).toBeVisible();
		await expect(firstItem.getByText(/ADR-\d{3}/)).toBeVisible();
	});

	test("renders an individual ADR page", async ({ page }) => {
		// ADR-001 is the foundational Preact island policy and has been
		// stable since the project's first ADR commit. Using a stable ADR
		// keeps this test resilient to additions.
		await page.goto("/docs/adr/001-preact-island-usage-policy/");

		const h1 = page.getByRole("heading", { level: 1 });
		await expect(h1).toBeVisible();
		await expect(h1).toContainText(/ADR-001/);

		// The back-to-index nav link must exist for keyboard users to
		// escape the ADR.
		const backLink = page.getByRole("link", {
			name: /All Architecture Decision Records/,
		});
		await expect(backLink).toBeVisible();
	});

	test("@a11y back link returns to the index", async ({ page }) => {
		await page.goto("/docs/adr/001-preact-island-usage-policy/");
		await page.getByRole("link", { name: /All Architecture Decision Records/ }).click();
		await expect(page).toHaveURL(/\/docs\/adr\/?$/);
	});
});
