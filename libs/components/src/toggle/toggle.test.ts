import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./toggle.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/toggle/${exampleName}`);
  const driver = createTestDriver(page);
  return { driver };
}

test.describe("Mouse Behavior", () => {
  test("GIVEN a default toggle WHEN clicking THEN it should be pressed", async ({
    page
  }) => {
    const { driver: d } = await setup(page, "hero");

    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "false");
    await expect(d.getRoot()).not.toHaveAttribute("data-pressed", "");

    await d.getRoot().click();

    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "true");
    await expect(d.getRoot()).toHaveAttribute("data-pressed", "");
  });

  test("GIVEN a pressed toggle WHEN clicking THEN it should not be pressed", async ({
    page
  }) => {
    const { driver: d } = await setup(page, "initial");

    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "true");
    await expect(d.getRoot()).toHaveAttribute("data-pressed", "");

    await d.getRoot().click();

    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "false");
    await expect(d.getRoot()).not.toHaveAttribute("data-pressed", "");
  });
});

test.describe("Keyboard Behavior", () => {
  test("GIVEN a toggle WHEN pressing 'Space' THEN it should be pressed", async ({
    page
  }) => {
    const { driver: d } = await setup(page, "hero");

    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "false");
    await expect(d.getRoot()).not.toHaveAttribute("data-pressed", "");

    await d.getRoot().press("Space");

    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "true");
    await expect(d.getRoot()).toHaveAttribute("data-pressed", "");
  });

  test("GIVEN a pressed toggle WHEN pressing 'Space' THEN it should not be pressed", async ({
    page
  }) => {
    const { driver: d } = await setup(page, "initial");

    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "true");
    await expect(d.getRoot()).toHaveAttribute("data-pressed", "");

    await d.getRoot().press("Space");

    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "false");
    await expect(d.getRoot()).not.toHaveAttribute("data-pressed", "");
  });

  test("GIVEN a toggle WHEN pressing 'Enter' THEN it should be pressed", async ({
    page
  }) => {
    const { driver: d } = await setup(page, "hero");

    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "false");
    await expect(d.getRoot()).not.toHaveAttribute("data-pressed", "");

    await d.getRoot().press("Enter");

    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "true");
    await expect(d.getRoot()).toHaveAttribute("data-pressed", "");
  });

  test("GIVEN a pressed toggle WHEN pressing 'Enter' THEN it should not be pressed", async ({
    page
  }) => {
    const { driver: d } = await setup(page, "initial");

    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "true");
    await expect(d.getRoot()).toHaveAttribute("data-pressed", "");

    await d.getRoot().press("Enter");

    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "false");
    await expect(d.getRoot()).not.toHaveAttribute("data-pressed", "");
  });
});

test.describe("Aria and Data Attributes", () => {
  test('GIVEN a toggle WHEN rendered THEN it has type="button"', async ({ page }) => {
    const { driver: d } = await setup(page, "hero");
    await expect(d.getRoot()).toHaveAttribute("type", "button");
  });

  test('GIVEN a toggle WHEN rendered THEN aria-pressed="false"', async ({ page }) => {
    const { driver: d } = await setup(page, "hero");
    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "false");
  });

  test("GIVEN a pressed toggle WHEN toggled THEN aria-pressed updates", async ({
    page
  }) => {
    const { driver: d } = await setup(page, "hero");
    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "false");
    await d.getRoot().click();
    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "true");
    await d.getRoot().click();
    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "false");
  });

  test("GIVEN a toggle WHEN state changes THEN data-pressed updates", async ({
    page
  }) => {
    const { driver: d } = await setup(page, "hero");
    await expect(d.getRoot()).not.toHaveAttribute("data-pressed", "");
    await d.getRoot().click();
    await expect(d.getRoot()).toHaveAttribute("data-pressed", "");
    await d.getRoot().click();
    await expect(d.getRoot()).not.toHaveAttribute("data-pressed", "");
  });
});

test.describe("Signal based state", () => {
  test("GIVEN a toggle with signal based state WHEN external signal becomes true THEN toggle is pressed", async ({
    page
  }) => {
    const { driver: d } = await setup(page, "signal");

    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "true");
    await expect(d.getRoot()).toHaveAttribute("data-pressed", "");

    await d.locator.getByRole("button", { name: "Toggle Signal" }).click();

    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "true");
    await expect(d.getRoot()).toHaveAttribute("data-pressed", "");
  });

  test("GIVEN a toggle with signal based state WHEN external signal becomes false THEN toggle is not pressed", async ({
    page
  }) => {
    const { driver: d } = await setup(page, "signal");

    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "true");
    await expect(d.getRoot()).toHaveAttribute("data-pressed", "");

    await expect(d.locator.getByText("true")).toBeVisible();

    await d.locator.getByRole("button", { name: "Toggle Signal" }).click();

    await expect(d.getRoot()).not.toHaveAttribute("data-pressed", "");
    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "false");

    await expect(d.locator.getByText("false")).toBeVisible();
  });
});

test.describe("Handlers", () => {
  test("GIVEN a toggle with onChange$ WHEN toggled on THEN handler is called", async ({
    page
  }) => {
    const { driver: d } = await setup(page, "change");

    await expect(d.locator.getByText("Count: 0")).toBeVisible();

    await d.getRoot().click();

    await expect(d.locator.getByText("Count: 1")).toBeVisible();
  });

  test("GIVEN a toggle with onChange$ WHEN toggled off THEN handler is called", async ({
    page
  }) => {
    const { driver: d } = await setup(page, "change");

    await expect(d.locator.getByText("Count: 0")).toBeVisible();
    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "false");

    await d.getRoot().click();

    await expect(d.locator.getByText("Count: 1")).toBeVisible();
    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "true");
    await d.getRoot().click();

    await expect(d.locator.getByText("Count: 2")).toBeVisible();
    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "false");
  });
});

test.describe("Disabled", () => {
  test("GIVEN a disabled toggle WHEN rendered THEN it has disabled and aria-disabled attributes", async ({
    page
  }) => {
    const { driver: d } = await setup(page, "disabled");
    await expect(d.getRoot()).toBeDisabled();
    await expect(d.getRoot()).toHaveAttribute("aria-disabled", "true");
  });
});

test.describe("Indicator", () => {
  test("GIVEN a toggle with Indicator WHEN not pressed THEN fallback content is visible", async ({
    page
  }) => {
    const { driver: d } = await setup(page, "indicator");
    const indicator = d.getIndicator();

    await expect(indicator.getByText("Is Off")).toBeVisible();
    await expect(indicator.getByText("Is On")).toBeHidden();
  });

  test("GIVEN a toggle with Indicator WHEN pressed THEN indicator content is visible", async ({
    page
  }) => {
    const { driver: d } = await setup(page, "indicator");
    const indicator = d.getIndicator();

    await d.getRoot().click();

    await expect(indicator.getByText("Is On")).toBeVisible();
    await expect(indicator.getByText("Is Off")).toBeHidden();
  });
});

test.describe("CSR", () => {
  test("GIVEN a toggle WHEN client-side rendered THEN toggle root is visible", async ({
    page
  }) => {
    const { driver: d } = await setup(page, "csr");

    await d.locator.getByRole("button", { name: "Render Toggle" }).click();
    await expect(d.getRoot()).toBeVisible();
  });

  test("GIVEN a CSR toggle WHEN clicked THEN state changes", async ({ page }) => {
    const { driver: d } = await setup(page, "csr");

    await d.locator.getByRole("button", { name: "Render Toggle" }).click();
    await expect(d.getRoot()).toBeVisible();
    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "false");

    await d.getRoot().click();
    await expect(d.getRoot()).toHaveAttribute("aria-pressed", "true");
  });
});
