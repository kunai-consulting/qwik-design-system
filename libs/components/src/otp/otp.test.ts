import { test, expect, type Page } from "@playwright/test";
import { createTestDriver } from "./otp.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/otp/${exampleName}`);

  const driver = createTestDriver(page);

  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN an OTP control
        WHEN rendered
        THEN the hidden input should be empty
    `, async ({ page }) => {
    const d = await setup(page, "hero");

    await expect(d.getInput()).toHaveValue("");
  });

  test(`
      GIVEN an OTP control
      WHEN typing a number
      THEN the hidden input should be updated
    `, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    await input.pressSequentially("1");
    await expect(input).toHaveValue("1");

    await input.pressSequentially("234");
    await expect(input).toHaveValue("1234");
  });

  test(`
      GIVEN an OTP control
      WHEN typing a number greater than max length
      THEN the hidden input should remain unchanged
    `, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    await input.pressSequentially("12345");
    await expect(input).toHaveValue("1234");
  });
});
