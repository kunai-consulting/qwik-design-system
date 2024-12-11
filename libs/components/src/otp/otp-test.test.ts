import { test, expect, type Page } from "@playwright/test";
import { createTestDriver } from "./otp.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/checkbox/${exampleName}`);

  const driver = createTestDriver(page);

  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN an OTP control
        WHEN clicking on the ui
        THEN the hidden input should have focus
    `, async ({ page }) => {
    const d = await setup(page, "hero");

    await expect(d.getNativeInput()).not.toBeFocused();

    await d.getItemAt(0).click();

    await expect(d.getNativeInput()).toBeFocused();
  });

  test(`GIVEN an OTP control
        WHEN clicking on the ui
        THEN the first item should be highlighted
`, async ({ page }) => {
    const d = await setup(page, "hero");

    await expect(d.getNativeInput()).not.toBeFocused();

    await d.getItemAt(0).click();

    await expect(d.getItemAt(0)).toHaveAttribute("data-highlighted");
  });
});
