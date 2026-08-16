import { test, expect } from "@playwright/test";

test.describe("Home and Blog Flow", () => {
  test("should navigate from home to blog to post", async ({ page }) => {
    // 1. Visit homepage
    await page.goto("/");
    await expect(page).toHaveTitle(/Personal Universe/);

    // 2. Click on Blog link in navigation
    await page.click("text=Blog");
    await expect(page).toHaveURL(/.*\/blog/);
    await expect(page.locator("h1")).toContainText("Blog");

    // 3. Check that at least one blog post exists
    const postLinks = page.locator("a[href^='/blog/']");
    const count = await postLinks.count();
    expect(count).toBeGreaterThan(0);

    // 4. Click the first blog post
    await postLinks.first().click();
    await expect(page).toHaveURL(/.*\/blog\/.+/);

    // 5. Verify post renders correctly
    await expect(page.locator("article")).toBeVisible();
    await expect(page.locator("time")).toBeVisible();
    
    // 6. Navigate back
    await page.click("text=← Back to Blog");
    await expect(page).toHaveURL(/.*\/blog/);
  });
});
