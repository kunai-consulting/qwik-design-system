import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./checklist.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/checklist/${exampleName}`);
  return createTestDriver(page);
}

async function verifyAllCheckboxStates(
  d: ReturnType<typeof createTestDriver>,
  checked: boolean
) {
  for (let i = 0; i < 4; i++) {
    await expect(d.getTriggerAt(i)).toHaveAttribute(
      "aria-checked",
      checked ? "true" : "false"
    );
    await expect(d.getIndicatorAt(i))[checked ? "toBeVisible" : "toBeHidden"]();
  }
}

type Action = "click" | { key: string };

async function allCheckboxes(d: ReturnType<typeof createTestDriver>, action: Action) {
  for (let i = 0; i < 4; i++) {
    if (typeof action === "string" && action === "click") {
      await d.getTriggerAt(i).click();
    } else if ("key" in action) {
      await d.getTriggerAt(i).press(action.key);
    }
  }
}

test.describe("Select All", () => {
  test(`GIVEN a checklist
        WHEN no items are checked
        THEN the main checkbox should be unchecked`, async ({ page }) => {
    const d = await setup(page, "select-all");
    await expect(d.getMainIndicator()).toBeHidden();
    await expect(d.getMainTrigger()).toHaveAttribute("aria-checked", "false");
  });

  test(`GIVEN a checklist
        WHEN some items are checked
        THEN the main checkbox should be partially checked`, async ({ page }) => {
    const d = await setup(page, "select-all");

    // The first normal checkbox trigger.
    // The select all main checkbox does not have the [data-qds-checkbox-trigger] locator, so it is not considered.
    const triggerIndex = 0;
    // The indicator index is the trigger index + 1, because we have to consider the select all main checkbox,
    // since it has the [data-qds-checkbox-indicator] locator
    const indicatorIndex = triggerIndex + 1;
    await d.getTriggerAt(triggerIndex).click();
    await expect(d.getIndicatorAt(indicatorIndex)).toBeVisible();
    await expect(d.getMainTrigger()).toHaveAttribute("aria-checked", "mixed");
  });

  test(`GIVEN a checklist
        WHEN all items are checked
        THEN main checkbox should be checked`, async ({ page }) => {
    const d = await setup(page, "select-all");

    await expect(d.getMainTrigger()).toHaveAttribute("aria-checked", "false");

    await allCheckboxes(d, "click");
    await verifyAllCheckboxStates(d, true);

    await expect(d.getMainTrigger()).toHaveAttribute("aria-checked", "true");
    await expect(d.getMainIndicator()).toBeVisible();
  });

  test(`GIVEN a checklist
        WHEN the main checkbox is clicked
        THEN all items should be checked`, async ({ page }) => {
    const d = await setup(page, "select-all");

    await expect(d.getMainTrigger()).toHaveAttribute("aria-checked", "false");
    await expect(d.getMainIndicator()).toBeHidden();

    await d.getMainTrigger().click();
    await expect(d.getMainTrigger()).toHaveAttribute("aria-checked", "true");
    await expect(d.getMainIndicator()).toBeVisible();

    await verifyAllCheckboxStates(d, true);
  });

  test(`GIVEN a checklist with all items checked
        WHEN the main checkbox is clicked
        THEN all items should be unchecked`, async ({ page }) => {
    const d = await setup(page, "select-all");

    //setup
    await allCheckboxes(d, "click");
    await verifyAllCheckboxStates(d, true);

    await d.getMainTrigger().click();
    await verifyAllCheckboxStates(d, false);
  });
});

test.describe("Keyboard interaction", () => {
  test(`GIVEN a checklist
        WHEN Space is pressed on the main checkbox
        THEN its state should toggle`, async ({ page }) => {
    const d = await setup(page, "select-all");

    await d.getMainTrigger().press("Space");
    await expect(d.getMainTrigger()).toHaveAttribute("aria-checked", "true");
    await expect(d.getMainIndicator()).toBeVisible();

    await d.getMainTrigger().press("Space");
    await expect(d.getMainTrigger()).toHaveAttribute("aria-checked", "false");
    await expect(d.getMainIndicator()).toBeHidden();
  });

  test(`GIVEN a checklist
        WHEN Space is pressed on the main checkbox
        THEN all items should toggle`, async ({ page }) => {
    const d = await setup(page, "select-all");

    await d.getMainTrigger().press("Space");
    await verifyAllCheckboxStates(d, true);

    await d.getMainTrigger().press("Space");
    await verifyAllCheckboxStates(d, false);
  });
});

test.describe("a11y", () => {
  test(`GIVEN a checklist
        WHEN rendered
        THEN the checklist root should have a role of group`, async ({ page }) => {
    const d = await setup(page, "select-all");

    await expect(d.getRoot()).toHaveAttribute("role", "group");
  });

  test(`GIVEN a checklist item
        THEN it should have correct checkbox role and state`, async ({ page }) => {
    const d = await setup(page, "select-all");

    await expect(d.getTriggerAt(1)).toHaveAttribute("role", "checkbox");
    await expect(d.getTriggerAt(1)).toHaveAttribute("aria-checked", "false");
  });
});

test.describe("Form integration", () => {
  test(`GIVEN a checklist inside a form
        WHEN items are checked and the form is submitted
        THEN the checked items should be included in the form data`, async ({ page }) => {
    const d = await setup(page, "form");

    await d.getTriggerAt(1).click();
    await d.getTriggerAt(2).click();
    await d.getSubmitButton().click();

    await expect(d.getSubmittedData()).toContainText(
      '{ "events": "on", "fashion": "on" }'
    );
  });
});
