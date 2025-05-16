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

test.describe("keyboard navigation", () => {
  test(`GIVEN a tabs
        WHEN focus is inside the tablist
        THEN only the active tab should be focusable
`, async ({ page }) => {
    const d = await setup(page, "hero");

    await expect(d.getTriggerAt(0)).toHaveAttribute("tabindex", "0");
    await expect(d.getTriggerAt(1)).toHaveAttribute("tabindex", "-1");
    await expect(d.getTriggerAt(2)).toHaveAttribute("tabindex", "-1");
  });
});
