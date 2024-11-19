import { expect, test, type Page } from "@playwright/test";
import { createTestDriver } from "./checkbox.driver";
async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/checkbox/${exampleName}`);

  const driver = createTestDriver(page);

  const { getRoot } = driver;

  return {
    getRoot
  };
}

test.describe("critical functionality", () => {
  test(`GIVEN a checkbox
        WHEN clicked
        THEN it should be visible`, async ({ page }) => {
    const { getRoot } = await setup(page, "hero");
  });
});
