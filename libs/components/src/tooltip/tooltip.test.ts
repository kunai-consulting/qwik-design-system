import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./tooltip.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/tooltip/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("Tooltip Component", () => {
  test("GIVEN a tooltip WHEN rendered THEN it should have correct initial ARIA attributes", async ({
    page
  }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();

    await expect(trigger).toHaveAttribute("aria-describedby");
    await expect(content).toHaveAttribute("role", "tooltip");
    await expect(content).toBeHidden();
  });

  test("GIVEN a tooltip WHEN hovered THEN it should show content", async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();

    await trigger.hover();
    await expect(content).toBeVisible();
  });

  test("GIVEN a tooltip WHEN focused THEN it should show content", async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();

    await trigger.focus();
    await expect(content).toBeVisible();
  });

  test("GIVEN a tooltip WHEN mouse leaves THEN it should hide content", async ({
    page
  }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();

    await expect(trigger).toBeVisible();
    await trigger.hover();
    await expect(content).toBeVisible();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(100);
    await expect(content).toBeHidden();
  });

  test("GIVEN a tooltip WHEN blurred THEN it should hide content", async ({ page }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();

    await trigger.focus();
    await expect(content).toBeVisible();
    await trigger.blur();
    await expect(content).toBeHidden();
  });

  test("GIVEN a tooltip WHEN Escape is pressed THEN it should hide content", async ({
    page
  }) => {
    const driver = await setup(page, "hero");
    const trigger = driver.getTrigger();
    const content = driver.getContent();

    await trigger.hover();
    await expect(content).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(content).toBeHidden();
  });

  test("GIVEN a tooltip with delay WHEN hovered THEN it should wait before showing", async ({
    page
  }) => {
    const driver = await setup(page, "delay");
    const triggers = await driver.getTrigger().all();
    const contents = await driver.getContent().all();

    // Test the 1s delay tooltip (last one)
    await triggers[2].hover();
    await expect(contents[2]).toBeHidden();
    await page.waitForTimeout(1000);
    await expect(contents[2]).toBeVisible();
  });

  test("GIVEN a tooltip WHEN positioned THEN it should respect side and alignment", async ({
    page
  }) => {
    const driver = await setup(page, "positioning");
    const triggers = await driver.getTrigger().all();
    const contents = await driver.getContent().all();

    // Test the first tooltip in the side positions section
    await triggers[0].hover();
    await expect(contents[0]).toHaveAttribute("data-side", "top");
    await expect(contents[0]).toHaveAttribute("data-align", "center");
  });

  test("GIVEN a tooltip WHEN disabled THEN it should not show content", async ({
    page
  }) => {
    const driver = await setup(page, "disabled");
    const trigger = driver.getTrigger();
    const content = driver.getContent();

    await trigger.hover();
    await expect(content).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-disabled", "true");
  });

  test("GIVEN a tooltip WHEN arrow is present THEN it should be positioned correctly", async ({
    page
  }) => {
    const driver = await setup(page, "arrow");
    const trigger = driver.getTrigger();
    const arrow = driver.getArrow();

    await trigger.hover();
    await expect(arrow).toBeVisible();
    await expect(arrow).toHaveAttribute("data-side", "top");
  });
});
