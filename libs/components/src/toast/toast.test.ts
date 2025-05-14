import { expect, type Page, test } from "@playwright/test";
import { createTestDriver } from "./toast.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/toast/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a toast
        WHEN it is rendered
        THEN the toast should be visible`, async ({ page }) => {
    const d = await setup(page, "hero");
    await d.locator.click("[data-qds-toast-trigger]");
    await expect(d.getContent()).toBeVisible();
  });
});
