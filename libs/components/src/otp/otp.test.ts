import { test, expect, type Page } from "@playwright/test";
import { createTestDriver } from "./otp.driver";
import { modifier } from "./utils/modifier";

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

  test(`
      GIVEN an OTP control
      WHEN pressing the left arrow key and typing a number
      THEN the selected character should be replaced with the new number
    `, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    await input.pressSequentially("123");
    // arrow left on keyboard
    await input.press("ArrowLeft");
    await input.pressSequentially("1");
    await expect(input).toHaveValue("121");
  });

  test(`
      GIVEN an OTP control
      WHEN making a range selection (shift + arrow left)
      THEN the selected characters should be replaced with the new number
    `, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    await input.pressSequentially("1234");
    await expect(input).toHaveValue("1234");

    await input.press("Shift+ArrowLeft");
    await input.press("Shift+ArrowLeft");

    await expect(d.getItemAt(2)).toHaveAttribute("data-highlighted");
    await expect(d.getItemAt(3)).toHaveAttribute("data-highlighted");

    await input.pressSequentially("1");
    await expect(input).toHaveValue("121");
  });

  test(`
      GIVEN an OTP control that is full and the last character is selected
      WHEN typing a new number
      THEN the new number should swap with the last character
    `, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    // initial setup
    await input.pressSequentially("1234");

    await input.press("5");
    await expect(input).toHaveValue("1235");
  });

  test(`GIVEN an OTP control that is full and the last character is selected
        WHEN selecting everything and pressing backspace
        THEN the OTP should be cleared
    `, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    await input.pressSequentially("1234");
    await expect(input).toHaveValue("1234");

    await input.press(`${modifier}+Backspace`);
    await expect(input).toHaveValue("");
  });

  // should backspace selected char

  test(`GIVEN an OTP control that is full
        WHEN hitting the left arrow key twice
        THEN the third to last character should be selected
    `, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    await input.pressSequentially("1234");
    await expect(input).toHaveValue("1234");

    await input.press("ArrowLeft");
    await input.press("ArrowLeft");

    await expect(d.getItemAt(1)).toHaveAttribute("data-highlighted");
  });

  test(`GIVEN an OTP control with a selected character
        WHEN hitting backspace
        THEN the selected character should be deleted
        AND the characters to the right should shift back 
    `, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    await input.pressSequentially("1234");
    await expect(input).toHaveValue("1234");

    await input.press("ArrowLeft");
    await input.press(`${modifier}+Backspace`);

    await expect(input).toHaveValue("124");
  });

  test(`GIVEN a full OTP control
        WHEN hitting delete at different positions
        THEN characters should be deleted correctly
    `, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    // Test delete at the end
    await input.pressSequentially("123456");
    await expect(input).toHaveValue("123456");
    await input.press("Delete");
    await expect(input).toHaveValue("12345");

    // Test delete at the beginning
    await input.press("Home");
    await input.press("Delete");
    await expect(input).toHaveValue("2345");

    // Test delete in the middle
    await input.press("ArrowRight");
    await input.press("ArrowRight");
    await input.press("Delete");
    await expect(input).toHaveValue("235");
  });

  test(`GIVEN an OTP control that is full
        WHEN the OTP is complete
        THEN an onComplete handler should be called
    `, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    await input.pressSequentially("1234");
    await expect(input).toHaveValue("1234");

    // we disable it in onComplete$
    await expect(input).toBeDisabled();
  });
});
