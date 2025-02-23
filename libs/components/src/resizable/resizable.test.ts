import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./resizable.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/resizable/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("critical functionality", () => {
  test(`GIVEN a resizable panel
        WHEN the handle is dragged horizontally
        THEN the panel width should update`, async ({ page }) => {
    const d = await setup(page, "hero");

    await d.getHandle().dragTo(d.getHandle(), {
      targetPosition: { x: 100, y: 0 },
    });
    await expect(d.getPanel()).toHaveCSS("width", "300px");
  });

  test(`GIVEN a resizable panel with vertical orientation
        WHEN the handle is dragged vertically  
        THEN the panel height should update`, async ({ page }) => {
    const d = await setup(page, "vertical");

    await d.getHandle().dragTo(d.getHandle(), {
      targetPosition: { x: 0, y: 100 },
    });
    await expect(d.getPanel()).toHaveCSS("height", "300px");
  });

  test(`GIVEN a resizable panel with min width
        WHEN dragged below minimum
        THEN width should not go below minimum`, async ({ page }) => {
    const d = await setup(page, "constrained");

    await d.getHandle().dragTo(d.getHandle(), {
      targetPosition: { x: -500, y: 0 },
    });
    await expect(d.getPanel()).toHaveCSS("width", "100px");
  });

  test(`GIVEN a resizable panel with max width
        WHEN dragged above maximum
        THEN width should not exceed maximum`, async ({ page }) => {
    const d = await setup(page, "constrained");

    await d.getHandle().dragTo(d.getHandle(), {
      targetPosition: { x: 500, y: 0 },
    });
    await expect(d.getPanel()).toHaveCSS("width", "500px");
  });
});

test.describe("state", () => {
  test(`GIVEN a resizable panel with initial size
        WHEN rendered
        THEN it should have the correct initial size`, async ({ page }) => {
    const d = await setup(page, "initial");
    await expect(d.getPanel()).toHaveCSS("width", "200px");
  });

  test(`GIVEN a resizable panel with onChange$
        WHEN resized
        THEN the onChange$ handler should be called with new size`, async ({
    page,
  }) => {
    const d = await setup(page, "reactive");
    const sizeDisplay = page.locator("[data-test-size]");

    await d.getHandle().dragTo(d.getHandle(), {
      targetPosition: { x: 100, y: 0 },
    });
    await expect(sizeDisplay).toHaveText("300");
  });

  test(`GIVEN a resizable panel with onChange$
        WHEN resize starts and ends
        THEN appropriate lifecycle events should fire`, async ({ page }) => {
    const d = await setup(page, "events");
    const eventsDisplay = page.locator("[data-test-events]");

    await d.getHandle().dragTo(d.getHandle(), {
      targetPosition: { x: 50, y: 0 },
    });

    await expect(eventsDisplay).toContainText("onResizeStart called");
    await expect(eventsDisplay).toContainText("onResize called");
    await expect(eventsDisplay).toContainText("onResizeEnd called");
  });

  test(`GIVEN a collapsible panel
        WHEN going over the collapse threshold
        THEN panel should collapse`, async ({ page }) => {
    const d = await setup(page, "collapsible");

    await d.getHandle().dragTo(d.getHandle(), {
      targetPosition: { x: -500, y: 0 },
    });
    await expect(d.getPanel()).toHaveCSS("width", "0px");
  });

  test(`GIVEN a collapsible panel
        WHEN onCollapseChange$ is provided
        THEN it should fire when panel collapses`, async ({ page }) => {
    const d = await setup(page, "collapsible");
    const collapseStateDisplay = page.locator("[data-test-collapse-state]");

    await d.getHandle().dragTo(d.getHandle(), {
      targetPosition: { x: -500, y: 0 },
    });
    await expect(collapseStateDisplay).toHaveText("collapsed");
  });

  test(`GIVEN a resizable root with orientation="vertical"
        WHEN rendered
        THEN panels should stack vertically`, async ({ page }) => {
    const d = await setup(page, "vertical");
    await expect(d.getRoot()).toHaveCSS("flex-direction", "column");
  });

  test(`GIVEN a disabled resizable root
        WHEN attempting to resize
        THEN panel size should not change`, async ({ page }) => {
    const d = await setup(page, "disabled");
    const initialWidth = await d
      .getPanel()
      .evaluate((el) => window.getComputedStyle(el).width);

    await d.getHandle().dragTo(d.getHandle(), {
      targetPosition: { x: 100, y: 0 },
    });
    await expect(d.getPanel()).toHaveCSS("width", initialWidth);
  });

  test(`GIVEN a resizable panel with snap points
        WHEN dragged near a snap point
        THEN it should snap to the nearest point`, async ({ page }) => {
    const d = await setup(page, "snap");

    await d.getHandle().dragTo(d.getHandle(), {
      targetPosition: { x: 95, y: 0 },
    });
    await expect(d.getPanel()).toHaveCSS("width", "300px");
  });
});

test.describe("a11y", () => {
  test(`GIVEN a resizable panel
        WHEN focused
        THEN handle should have correct ARIA attributes`, async ({ page }) => {
    const d = await setup(page, "hero");

    await expect(d.getHandle()).toHaveAttribute("role", "separator");
    await expect(d.getHandle()).toHaveAttribute("aria-valuenow", "200");
    await expect(d.getHandle()).toHaveAttribute("aria-valuemin", "100");
    await expect(d.getHandle()).toHaveAttribute("aria-valuemax", "500");
  });

  test(`GIVEN a resizable panel
        WHEN using keyboard controls
        THEN size should adjust accordingly`, async ({ page }) => {
    const d = await setup(page, "hero");

    await d.getHandle().focus();
    await d.getHandle().press("ArrowRight");
    await d.getHandle().press("ArrowRight");
    await d.getHandle().press("ArrowLeft");
    await expect(d.getPanel()).toHaveCSS("width", "210px");
  });

  test(`GIVEN a vertical resizable panel
        WHEN using keyboard controls
        THEN size should adjust accordingly`, async ({ page }) => {
    const d = await setup(page, "vertical");

    await d.getHandle().focus();
    await d.getHandle().press("ArrowDown");
    await d.getHandle().press("ArrowDown");
    await d.getHandle().press("ArrowUp");
    await expect(d.getPanel()).toHaveCSS("height", "210px");
  });

  test(`GIVEN a resizable panel
        WHEN using keyboard with shift modifier
        THEN size should adjust by larger increment`, async ({ page }) => {
    const d = await setup(page, "hero");

    await d.getHandle().focus();
    await d.getHandle().press("Shift+ArrowRight");
    await expect(d.getPanel()).toHaveCSS("width", "250px");
  });
});
