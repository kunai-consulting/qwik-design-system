import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./popover.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/popover/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a popover component
        WHEN it is rendered
        THEN the trigger should be visible`, async ({ page }) => {
    const d = await setup(page, "base");
    await expect(d.getTrigger()).toBeVisible();
  });
});
