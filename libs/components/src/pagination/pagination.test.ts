import { expect, test } from "@playwright/test";

test.describe("random", () => {
  test("should be random", async ({ page }) => {
    await page.goto("http://localhost:5174/pagination/hero");
  });
});
