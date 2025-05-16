import AxeBuilder from "@axe-core/playwright";
import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./tabs.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/tabs/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a tabs component
        WHEN rendered
        THEN it should meet the axe a11y requirements
`, async ({ page }) => {
    await setup(page, "hero");

    const initialResults = await new AxeBuilder({ page })
      .include("[data-qds-tabs-root]")
      .analyze();

    expect(initialResults.violations).toEqual([]);
  });
});
