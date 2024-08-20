import { expect, test } from "@playwright/test";

test.describe("random", () => {
  test("should be random", async ({ page }) => {
    await page.goto("/");
    const random = await page.locator("random-number").innerText();
    expect(random).toBeTruthy();
  });
});
