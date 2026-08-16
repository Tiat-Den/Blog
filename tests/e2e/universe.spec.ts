import { test, expect } from "@playwright/test";

test.describe("Universe Explore Flow", () => {
  test("should load universe graph and switch to list view", async ({ page }) => {
    await page.goto("/explore");
    
    // Check title
    await expect(page.locator("h1")).toContainText("Personal Universe");
    
    // Switch to List View
    await page.click("text=List");
    
    // Expect filter badges to be visible
    await expect(page.locator("text=All")).toBeVisible();
    await expect(page.locator("text=Posts")).toBeVisible();

    // Ensure list cards are rendered
    const cards = page.locator(".grid > div");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    
    // Click on a "Post" filter
    await page.click("text=Posts");
    
    // Ensure at least some nodes remain
    const filteredCount = await page.locator(".grid > div").count();
    expect(filteredCount).toBeGreaterThan(0);
    
    // Click on the first item link
    await page.locator(".grid > div").first().locator("a").first().click();
    
    // We should be redirected to the content page
    await expect(page).toHaveURL(/.*\/blog\/.+|.*\/projects\/.+/);
  });
});
