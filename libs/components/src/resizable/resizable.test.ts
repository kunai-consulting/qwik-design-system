import { type Page, expect, test } from "@playwright/test";
import { createTestDriver } from "./resizable.driver";

async function setup(page: Page, exampleName: string) {
  await page.goto(`http://localhost:6174/base/resizable/${exampleName}`);
  const driver = createTestDriver(page);
  return driver;
}

test.describe("Basic Functionality", () => {
  test(`GIVEN a resizable component
      WHEN rendered
      THEN the handle should have correct role and ARIA attributes`, async ({ page }) => {
    const d = await setup(page, "hero");
    const handle = d.getHandle();

    await expect(handle).toHaveAttribute("role", "separator");
    await expect(handle).toHaveAttribute("aria-orientation", "horizontal");
    await expect(handle).toHaveAttribute("tabindex", "0");
  });

  test(`GIVEN a resizable panel with initial width
      WHEN rendered
      THEN should have correct initial size`, async ({ page }) => {
    const d = await setup(page, "hero");
    const panel = d.getPanelAt(0);

    await expect(panel).toHaveCSS("width", "200px"); // Initial width from props
  });

  test(`GIVEN a resizable panel
      WHEN the handle is dragged horizontally
      THEN panels should resize proportionally`, async ({ page }) => {
    const d = await setup(page, "hero");
    const firstPanel = d.getPanelAt(0);
    const secondPanel = d.getPanelAt(1);

    const initialFirstWidth = await d.getPanelSize(firstPanel);
    const initialSecondWidth = await d.getPanelSize(secondPanel);

    await d.dragHandleBy(d.getHandle(), 100, 0);

    await expect(firstPanel).toHaveCSS("width", `${initialFirstWidth + 100}px`);
    await expect(secondPanel).toHaveCSS("width", `${initialSecondWidth - 100}px`);
  });
});

test.describe("Size Constraints", () => {
  test(`GIVEN a resizable panel with minWidth
      WHEN dragged below minimum
      THEN should not resize below minimum`, async ({ page }) => {
    const d = await setup(page, "hero");
    const panel = d.getPanelAt(0);
    const { min } = await d.getPanelConstraints(panel);

    await d.dragHandleBy(d.getHandle(), -500, 0);
    await expect(panel).toHaveCSS("width", `${min}px`);
  });

  test(`GIVEN a resizable panel with maxWidth
      WHEN dragged above maximum
      THEN should not resize above maximum`, async ({ page }) => {
    const d = await setup(page, "hero");
    const panel = d.getPanelAt(0);
    const { max } = await d.getPanelConstraints(panel);

    await d.dragHandleBy(d.getHandle(), 500, 0);
    await expect(panel).toHaveCSS("width", `${max}px`);
  });
});

test.describe("Vertical Orientation", () => {
  test(`GIVEN a vertical resizable
      WHEN rendered
      THEN should have vertical orientation`, async ({ page }) => {
    const d = await setup(page, "vertical");

    expect(await d.getOrientation()).toBe("vertical");
    await expect(d.getRoot()).toHaveCSS("flex-direction", "column");
  });

  test(`GIVEN a vertical resizable
      WHEN handle is dragged vertically
      THEN panels should resize vertically`, async ({ page }) => {
    const d = await setup(page, "vertical");
    const panel = d.getPanelAt(0);
    const initialHeight = await d.getPanelSize(panel);

    await d.dragHandleBy(d.getHandle(), 0, 20);
    await expect(panel).toHaveCSS("height", `${initialHeight + 20}px`);
  });
});

test.describe("Collapsible Panels", () => {
  test(`GIVEN a collapsible panel
      WHEN dragged below collapse threshold
      THEN should collapse to collapsedSize`, async ({ page }) => {
    const d = await setup(page, "collapsible");
    const panel = d.getPanelAt(0);
    const { threshold, collapsed } = await d.getPanelConstraints(panel);

    await d.dragHandleBy(d.getHandle(), -(threshold * 2000), 0);

    expect(await d.isPanelCollapsed(panel)).toBe(true);
    await expect(panel).toHaveCSS("width", `${collapsed}px`);
  });

  test(`GIVEN a collapsed panel
      WHEN dragged to expand
      THEN should expand and fire callback`, async ({ page }) => {
    const d = await setup(page, "collapsible");
    const panel = d.getPanelAt(0);

    await d.dragHandleBy(d.getHandle(), -200, 0);
    expect(await d.isPanelCollapsed(panel)).toBe(true);

    await d.dragHandleBy(d.getHandle(), 200, 0);
    expect(await d.isPanelCollapsed(panel)).toBe(false);
  });
});

test.describe("Keyboard Navigation", () => {
  test(`GIVEN a horizontal resizable
      WHEN arrow keys are pressed
      THEN should resize by step`, async ({ page }) => {
    const d = await setup(page, "hero");
    const panel = d.getPanelAt(0);
    const handle = d.getHandle();
    const initialSize = await d.getPanelSize(panel);

    await handle.focus();
    await page.keyboard.press("ArrowRight");
    const size = await d.getPanelSize(panel);

    expect(size).toBeGreaterThan(initialSize);
  });

  test(`GIVEN a resizable
      WHEN Shift+Arrow is pressed
      THEN should resize by larger step`, async ({ page }) => {
    const d = await setup(page, "hero");
    const panel = d.getPanelAt(0);
    const handle = d.getHandle();
    const initialSize = await d.getPanelSize(panel);

    await handle.focus();
    await page.keyboard.press("Shift+ArrowRight");
    const size = await d.getPanelSize(panel);

    expect(size).toBeGreaterThan(initialSize);
  });

  test(`GIVEN a resizable
      WHEN Home/End keys are pressed
      THEN should collapse/expand to limits`, async ({ page }) => {
    const d = await setup(page, "hero");
    const panel = d.getPanelAt(0);
    const handle = d.getHandle();
    const { min, max } = await d.getPanelConstraints(panel);

    await handle.focus();
    await page.keyboard.press("Home");
    await expect(panel).toHaveCSS("width", `${min}px`);

    await page.keyboard.press("End");
    await expect(panel).toHaveCSS("width", `${max}px`);
  });
});

test.describe("Callbacks", () => {
  test(`GIVEN a panel with onResize$
    WHEN resized
    THEN callback should fire with new size`, async ({ page }) => {
    const d = await setup(page, "callback");

    const waitForLog = new Promise((resolve) => {
      page.on("console", (msg) => {
        if (msg.text().includes("Left panel size:")) {
          resolve(msg.text());
        }
      });
    });

    await d.dragHandleBy(d.getHandle(), 100, 0);

    const logMessage = await waitForLog;
    expect(logMessage).toContain("Left panel size:");
    expect(logMessage).toContain("300px");
  });

  test(`GIVEN a collapsible panel with callbacks
    WHEN collapsed/expanded
    THEN callbacks should fire`, async ({ page }) => {
    const d = await setup(page, "collapsible");

    const waitForCollapse = new Promise((resolve) => {
      page.on("console", (msg) => {
        if (msg.text() === "Panel collapsed") {
          resolve(true);
        }
      });
    });

    const waitForExpand = new Promise((resolve) => {
      page.on("console", (msg) => {
        if (msg.text() === "Panel expanded") {
          resolve(true);
        }
      });
    });

    await d.dragHandleBy(d.getHandle(), -200, 0);
    await waitForCollapse;

    await d.dragHandleBy(d.getHandle(), 200, 0);
    await waitForExpand;
  });
});

test.describe("Disabled State", () => {
  test(`GIVEN a disabled resizable
      WHEN attempting to drag
      THEN panels should not resize`, async ({ page }) => {
    const d = await setup(page, "disabled");
    const panel = d.getPanelAt(0);
    const initialSize = await d.getPanelSize(panel);

    expect(await d.isRootDisabled()).toBe(true);
    await d.dragHandleBy(d.getHandle(), 100, 0);

    await expect(panel).toHaveCSS("width", `${initialSize}px`);
  });

  test(`GIVEN a disabled resizable
      WHEN using keyboard navigation
      THEN panels should not resize`, async ({ page }) => {
    const d = await setup(page, "disabled");
    const panel = d.getPanelAt(0);
    const handle = d.getHandle();
    const initialSize = await d.getPanelSize(panel);

    await handle.focus();
    await page.keyboard.press("ArrowRight");

    await expect(panel).toHaveCSS("width", `${initialSize}px`);
  });
});

test.describe("Persistence", () => {
  test(`GIVEN a resizable with storageKey
    WHEN resized and page reloaded
    THEN should restore sizes from localStorage`, async ({ page }) => {
    const d = await setup(page, "persistent");
    const panel = d.getPanelAt(0);

    await d.dragHandleBy(d.getHandle(), 100, 0);
    const newSize = await d.getPanelSize(panel);

    const storageKey = await d.getRoot().getAttribute("storageKey");
    const stored = await d.getLocalStorage(page, `resizable-${storageKey}`);
    const storedSizes = stored ? JSON.parse(stored) : null;
    expect(storedSizes[0]).toBe(newSize);

    await page.reload();
    await expect(panel).toHaveCSS("width", `${newSize}px`);
  });

  test(`GIVEN a resizable with storageKey
    WHEN page is reloaded
    THEN should handle hydration correctly`, async ({ page }) => {
    const d = await setup(page, "persistent");

    const panel = d.getPanelAt(0);
    await d.dragHandleBy(d.getHandle(), 100, 0);
    const newSize = await d.getPanelSize(panel);

    await page.reload();
    const root = d.getRoot();

    await expect(root).toHaveAttribute("data-hydrated", "true");
    await expect(root).toHaveCSS("visibility", "visible");

    await expect(panel).toHaveCSS("width", `${newSize}px`);
  });
});
