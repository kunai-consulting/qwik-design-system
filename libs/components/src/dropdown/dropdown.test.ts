import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./dropdown.driver";

// Define the component structure for the test driver
const DropdownComponent = {
  Root: "data-qds-dropdown-root",
  Trigger: "data-qds-dropdown-trigger",
  Content: "data-qds-dropdown-content",
  Item: "data-qds-dropdown-item"
};

async function setup(page: Page, exampleName: string) {
  // Use the dynamic route provided by IsolateTest
  await page.goto(`http://localhost:6174/base/dropdown/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("Dropdown Component", () => {
  test(`GIVEN an initial Dropdown
        WHEN rendered
        THEN it should have correct initial ARIA attributes`, async ({ page }) => {
    // GIVEN
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();

    // WHEN - N/A (initial render check)

    // THEN
    await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(driver.getContent()).toBeHidden(); // Also check content is initially hidden
  });

  test(`GIVEN a closed Dropdown
        WHEN the trigger is clicked
        THEN the dropdown content should open`, async ({ page }) => {
    // GIVEN
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();
    await expect(content).toBeHidden();

    // WHEN
    await trigger.click();

    // THEN
    await expect(content).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test(`GIVEN an open Dropdown
        WHEN the trigger is clicked again
        THEN the dropdown content should close`, async ({ page }) => {
    // GIVEN
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();
    await trigger.click(); // Open it first
    await expect(content).toBeVisible();

    // WHEN
    await trigger.click();

    // THEN
    await expect(content).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test(`GIVEN an open Dropdown
        WHEN the Escape key is pressed
        THEN the dropdown content should close`, async ({ page }) => {
    // GIVEN
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();
    await trigger.click(); // Open it first
    await expect(content).toBeVisible();
    await trigger.focus(); // Ensure focus is suitable for key press

    // WHEN
    await driver.locator.press("body", "Escape");

    // THEN
    await expect(content).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test(`GIVEN an open Dropdown
        WHEN clicking outside the dropdown content
        THEN the dropdown content should close`, async ({ page }) => {
    // GIVEN
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();
    await trigger.click(); // Open it first
    await expect(content).toBeVisible();

    // WHEN
    // Click outside (on the body or another element)
    await driver.locator.locator("body").click({ force: true, position: { x: 0, y: 0 } }); // Click top-left corner

    // THEN
    await expect(content).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  // Add more tests here following the pattern (e.g., item selection, keyboard nav)
});

// Helper function to mount component for testing (adapt based on actual test setup)
// This might live in apps/component-tests or a shared test utility
// const mount = async (page, componentCode) => {
//   await page.setContent(`
//     <html>
//       <head>
//         <script type="module">
//           // Import necessary Qwik/component things
//         </script>
//       </head>
//       <body>
//         <div id="test-root"></div>
//         <script type="module">
//           import { render } from '@builder.io/qwik';
//           // Mount the component onto #test-root
//           // render(document.getElementById('test-root'), ${componentCode});
//         </script>
//       </body>
//     </html>
//   `);
// };
