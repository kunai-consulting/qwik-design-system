import { type Locator, type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./otp.driver";
import { modifier } from "./utils/modifier";

/** Playwright doesn't support selectionchange, this is a hack / workaround */
async function setupEventListeners(input: Locator) {
  await input.evaluate((el) => {
    return new Promise<void>((resolve) => {
      let lastStart = (el as HTMLInputElement).selectionStart;
      let lastEnd = (el as HTMLInputElement).selectionEnd;
      let stableCount = 0;
      let isResolved = false;

      const checkSelection = () => {
        if (isResolved) return;

        const currentStart = (el as HTMLInputElement).selectionStart;
        const currentEnd = (el as HTMLInputElement).selectionEnd;

        console.log("selection:", currentStart, currentEnd);

        if (currentStart === lastStart && currentEnd === lastEnd) {
          stableCount++;
          if (stableCount >= 3) {
            isResolved = true;
            resolve();
            return;
          }
        } else {
          stableCount = 0;
        }

        lastStart = currentStart;
        lastEnd = currentEnd;
        requestAnimationFrame(checkSelection);
      };

      const selectionListener = () => {
        if (isResolved) return;

        console.log(
          "selection change:",
          (el as HTMLInputElement).selectionStart,
          (el as HTMLInputElement).selectionEnd
        );
        stableCount = 0;
      };

      el.addEventListener("selectionchange", selectionListener);
      checkSelection();

      // Cleanup after 5 seconds to prevent hanging
      setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          el.removeEventListener("selectionchange", selectionListener);
          resolve();
        }
      }, 5000);
    });
  });
}

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/otp/${exampleName}`);
  const driver = createTestDriver(page);
  const input = driver.getInput();
  await input.focus();
  await setupEventListeners(input);
  return driver;
}

test.describe("critical functionality", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    // Clear any existing listeners
    await page.evaluate(() => {
      const oldEl = document.querySelector("input");
      if (oldEl) {
        const newEl = oldEl.cloneNode(true);
        oldEl.parentNode?.replaceChild(newEl, oldEl);
      }
    });
  });

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
      WHEN pressing the left arrow key and typing a number
      THEN the selected character should be replaced with the new number
    `, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    await input.pressSequentially("123");
    await expect(input).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(d.getItemAt(2)).toHaveAttribute("data-highlighted");

    await page.keyboard.insertText("1");
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
    await expect(input).toHaveValue("11");
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

    await input.pressSequentially("5");
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

    // Select all text first, then delete
    await input.press(`${modifier}+a`);
    await input.press("Backspace");
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

  test(`
    GIVEN a full OTP control
    WHEN hitting delete at the end
    THEN the last character should be deleted
  `, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    await input.pressSequentially("1234");
    await expect(input).toHaveValue("1234");
    await input.press("Delete");
    await expect(input).toHaveValue("123");
  });

  test(`
      GIVEN a full OTP control
      WHEN hitting delete at the beginning
      THEN the first character should be deleted
  `, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    await input.pressSequentially("1234");
    await input.press("Home");
    await input.press("Delete");
    await expect(input).toHaveValue("234");
  });

  test(`
      GIVEN a full OTP control
      WHEN hitting delete in the middle
      THEN the character at cursor position should be deleted
  `, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    await input.pressSequentially("1234");
    await input.press("Home");
    await input.press("ArrowRight");
    await input.press("ArrowRight");
    await input.press("Delete");
    await expect(input).toHaveValue("124");
  });

  test(`GIVEN an OTP control that is full
        WHEN the OTP is complete
        THEN an onComplete handler should be called
    `, async ({ page }) => {
    const d = await setup(page, "complete");
    const input = d.getInput();

    await input.pressSequentially("1234");
    await expect(input).toHaveValue("1234");

    // we disable it in onComplete$
    await expect(input).toBeDisabled();
  });

  test(`GIVEN an OTP root with a value prop
        WHEN it is rendered
        THEN the initial value should be what value prop provides
`, async ({ page }) => {
    const d = await setup(page, "initial");
    const input = d.getInput();

    await expect(input).toHaveValue("1234");
  });

  test(`GIVEN an OTP root with a bind:value prop
        WHEN a signal is passed
        THEN the OTP's value should be the signal value
`, async ({ page }) => {
    const d = await setup(page, "reactive");
    const input = d.getInput();

    await expect(input).toHaveValue("");

    await page.locator("button").last().click();
    await expect(input).toHaveValue("1234");
  });

  test(`GIVEN an OTP root with a onChange$ prop
        WHEN the OTP value changes
        THEN the onChange$ handler should be called
    `, async ({ page }) => {
    const d = await setup(page, "change");
    const input = d.getInput();

    await input.pressSequentially("1");

    await expect(input).toHaveValue("1");

    // p tag rendered from onChange$
    await expect(page.getByRole("paragraph")).toBeVisible();
  });

  test(`GIVEN an OTP root
        WHEN programmatically disabled
        THEN the OTP should not be interactive
`, async ({ page }) => {
    const d = await setup(page, "disabled");
    const input = d.getInput();

    await page.locator("button").last().click();
    await expect(input).toBeDisabled();
  });

  test(`GIVEN an empty OTP control
        WHEN an invalid character is typed
        THEN highlight should remain on the first item
`, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    await input.press("-");
    await expect(d.getItemAt(0)).toHaveAttribute("data-highlighted");
    await expect(input).toHaveValue("");
  });

  test(`GIVEN an empty OTP control
    WHEN an invalid character is typed
    THEN highlight should remain on the first item
`, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    await input.press("-");
    await expect(d.getItemAt(0)).toHaveAttribute("data-highlighted");
    await expect(input).toHaveValue("");
  });

  test(`GIVEN an OTP control with some characters
        WHEN inserting a character between existing characters
        THEN the highlight should change direction at the insertion point
    `, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    await input.pressSequentially("124");

    await input.press("Home");
    await input.press("ArrowRight");

    await input.pressSequentially("3");

    await expect(input).toHaveValue("134");

    await expect(d.getItemAt(2)).toHaveAttribute("data-highlighted");
  });

  test(`GIVEN an OTP control with an initial value
        WHEN backspacing a character between existing filled characters
        AND the right arrow key is pressed
        THEN the highlight should move back to the previous highlighted item
    `, async ({ page }) => {
    const d = await setup(page, "hero");
    const input = d.getInput();

    // initial setup
    await input.pressSequentially("1234");
    await expect(input).toHaveValue("1234");
    await input.press("ArrowLeft");
    await expect(d.getItemAt(2)).toHaveAttribute("data-highlighted");

    await input.press("Backspace");
    await input.press("ArrowRight");
    await expect(d.getItemAt(2)).toHaveAttribute("data-highlighted");
  });
});
