import { expect, test, type Page } from "@playwright/test";
import { createTestDriver } from "./checkbox.driver";
async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/checkbox/${exampleName}`);

  const driver = createTestDriver(page);

  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a checkbox
        WHEN the root is clicked
        THEN the indicator should be visible`, async ({ page }) => {
    const d = await setup(page, "hero");

    await d.getTrigger().click();
    await expect(d.getIndicator()).toBeVisible();
  });

  test(`GIVEN a checkbox that is initially checked
        WHEN the root is clicked
        THEN the indicator should be hidden`, async ({ page }) => {
    const d = await setup(page, "hero");

    // initial setup
    await d.getTrigger().click();
    await expect(d.getIndicator()).toBeVisible();

    await d.getTrigger().click();
    await expect(d.getIndicator()).toBeHidden();
  });
});
