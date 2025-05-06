import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./toaster.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/toast/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a toast component
        WHEN it is rendered
        THEN it should have correct ARIA attributes`, async ({ page }) => {
    const d = await setup(page, "hero");

    await expect(d.getRoot()).toHaveAttribute("aria-live", "polite");
  });
});
