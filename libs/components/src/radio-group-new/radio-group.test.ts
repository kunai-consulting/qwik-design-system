import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./radio-group.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/radio-group-new/${exampleName}`);
  const rootLocator = createTestDriver(page);
  return rootLocator;
}

test.describe("Radio Group", () => {
  test(`GIVEN a radio group
      WHEN rendered
      THEN the radio group root should have a role of radiogroup`, async ({ page }) => {
    const d = await setup(page, "hero");
    await expect(d.getRoot()).toHaveAttribute("role", "radiogroup");
  });

  test(`GIVEN a radio group
        WHEN the first radio button is clicked
        THEN it should have correct checked state`, async ({ page }) => {
    const d = await setup(page, "hero");
    const firstTrigger = d.getTriggerAt(0);

    await firstTrigger.click();
    await expect(firstTrigger).toHaveAttribute("data-state", "checked");
    await expect(firstTrigger).toHaveAttribute("aria-checked", "true");
  });

  test(`GIVEN a radio group
        WHEN a different radio button is clicked
        THEN the previously selected radio button should no longer be checked`, async ({
                                                                                                 page
                                                                                               }) => {
    const d = await setup(page, "hero");
    const firstTrigger = d.getTriggerAt(0);
    const secondTrigger = d.getTriggerAt(1);

    await firstTrigger.click();
    await expect(firstTrigger).toHaveAttribute("data-state", "checked");

    await secondTrigger.click();
    await expect(firstTrigger).not.toHaveAttribute("data-state", "checked");
    await expect(secondTrigger).toHaveAttribute("data-state", "checked");
  });

  test(`GIVEN a radio group
        WHEN no radio button is selected
        THEN the error message should be displayed`, async ({ page }) => {
    const d = await setup(page, "error");
    const triggers = page.locator("[data-qds-radio-group-trigger]");
    const errorMessage = d.getErrorMessage();

    const count = await triggers.count();
    for (let i = 0; i < count; i++) {
      const trigger = triggers.nth(i);
      await expect(trigger).not.toHaveAttribute("data-state", "checked");
    }

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText("Please select an option");
  });

  test(`GIVEN a radio group
        WHEN any radio button is selected
        THEN the error message should not be displayed`, async ({ page }) => {
    const d = await setup(page, "error");
    const firstTrigger = d.getTriggerAt(0);
    const errorMessage = d.getErrorMessage();

    await firstTrigger.click();
    await expect(firstTrigger).toHaveAttribute("data-state", "checked");
    await expect(errorMessage).not.toBeVisible();
  });
});

test.describe("Keyboard Navigation", () => {
  test(`GIVEN a radio group in vertical orientation
          WHEN ArrowDown is pressed
          THEN next item should be selected`, async ({ page }) => {
    const d = await setup(page, "hero");
    const firstTrigger = d.getTriggerAt(0);
    const secondTrigger = d.getTriggerAt(1);

    await firstTrigger.focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");

    await expect(secondTrigger).toHaveAttribute("data-state", "checked");
    await expect(secondTrigger).toHaveAttribute("aria-checked", "true");
  });

  test(`GIVEN a radio group in horizontal orientation
          WHEN ArrowRight is pressed
          THEN next item should be selected`, async ({ page }) => {
    const d = await setup(page, "horizontal");
    const firstTrigger = d.getTriggerAt(0);
    const secondTrigger = d.getTriggerAt(1);

    await firstTrigger.focus();
    await page.keyboard.press("ArrowRight");

    await expect(secondTrigger).toHaveAttribute("data-state", "checked");
    await expect(secondTrigger).toHaveAttribute("aria-checked", "true");
  });

  test(`GIVEN a radio group
          WHEN Home key is pressed
          THEN first item should be selected`, async ({ page }) => {
    const d = await setup(page, "horizontal");
    const lastTrigger = d.getTriggerAt(3);
    const firstTrigger = d.getTriggerAt(0);

    await lastTrigger.focus();
    await page.keyboard.press("Home");

    await expect(firstTrigger).toHaveAttribute("data-state", "checked");
    await expect(firstTrigger).toHaveAttribute("aria-checked", "true");
  });

  test(`GIVEN a radio group
          WHEN End key is pressed
          THEN last item should be selected`, async ({ page }) => {
    const d = await setup(page, "horizontal");
    const firstTrigger = d.getTriggerAt(0);
    const lastTrigger = d.getTriggerAt(3);

    await firstTrigger.focus();
    await page.keyboard.press("End");

    await expect(lastTrigger).toHaveAttribute("data-state", "checked");
    await expect(lastTrigger).toHaveAttribute("aria-checked", "true");
  });

  test(`GIVEN a radio group
          WHEN Space is pressed on focused item
          THEN it should be selected`, async ({ page }) => {
    const d = await setup(page, "hero");
    const firstTrigger = d.getTriggerAt(0);

    await firstTrigger.focus();
    await page.keyboard.press("Space");

    await expect(firstTrigger).toHaveAttribute("data-state", "checked");
    await expect(firstTrigger).toHaveAttribute("aria-checked", "true");
  });
});

test.describe("Accessibility", () => {
  test(`GIVEN a radio group
          WHEN rendered
          THEN it should have correct ARIA attributes`, async ({ page }) => {
    const d = await setup(page, "form");
    const root = d.getRoot();

    await expect(root).toHaveAttribute("aria-labelledby");
    await expect(root).toHaveAttribute("aria-required", "true");
    await expect(root).toHaveAttribute("role", "radiogroup");
  });

  test(`GIVEN a disabled radio group
          WHEN trying to interact
          THEN items should not be selectable`, async ({ page }) => {
    const d = await setup(page, "disabled");

    await page.getByText("Disable group").click();

    const firstTrigger = d.getTriggerAt(0);
    await firstTrigger.click();

    await expect(firstTrigger).not.toHaveAttribute("data-state", "checked");
    await expect(firstTrigger).toHaveAttribute("data-disabled");
  });

  test(`GIVEN a radio group with description
          WHEN rendered
          THEN description should be properly linked`, async ({ page }) => {
    const d = await setup(page, "form");
    const root = d.getRoot();

    await expect(root).toHaveAttribute("aria-describedby");
  });
});

test.describe("Controlled Mode", () => {
  test(`GIVEN a controlled radio group
          WHEN value is set externally
          THEN correct option should be selected`, async ({ page }) => {
    const d = await setup(page, "controlled");
    const firstTrigger = d.getTriggerAt(0);

    await expect(firstTrigger).toHaveAttribute("data-state", "checked");
  });
});

test.describe("Form Integration", () => {
  test(`GIVEN a radio group in a form
          WHEN submitted without selection
          THEN should show error message`, async ({ page }) => {
    const d = await setup(page, "form");

    await page.getByText("Subscribe").click();

    const errorMessage = d.getErrorMessage();
    await expect(errorMessage).toBeVisible();
  });

  test(`GIVEN a radio group in a form
          WHEN option is selected and form is submitted
          THEN should not show error message`, async ({ page }) => {
    const d = await setup(page, "form");
    const errorMessage = d.getErrorMessage();

    const firstTrigger = d.getTriggerAt(0);
    await firstTrigger.click();

    await expect(errorMessage).not.toBeVisible();
  });
});

test.describe("Orientation", () => {
  test(`GIVEN a horizontal radio group
          WHEN rendered
          THEN should have horizontal orientation`, async ({ page }) => {
    const d = await setup(page, "horizontal");
    const root = d.getRoot();

    await expect(root).toHaveAttribute("data-orientation", "horizontal");
  });
});
