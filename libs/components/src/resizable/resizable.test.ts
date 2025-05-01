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

  test(`GIVEN a resizable content with initial width
      WHEN rendered
      THEN should have correct initial size`, async ({ page }) => {
    const d = await setup(page, "hero");
    const content = d.getContentAt(0);

    await expect(content).toHaveCSS("width", "200px"); // Initial width from props
  });

  test(`GIVEN a resizable content
      WHEN the handle is dragged horizontally
      THEN contents should resize proportionally`, async ({ page }) => {
    const d = await setup(page, "hero");
    const firstContent = d.getContentAt(0);
    const secondContent = d.getContentAt(1);

    const initialFirstWidth = await d.getContentSize(firstContent);
    const initialSecondWidth = await d.getContentSize(secondContent);

    await d.dragHandleBy(d.getHandle(), 100, 0);

    await expect(firstContent).toHaveCSS("width", `${initialFirstWidth + 100}px`);
    await expect(secondContent).toHaveCSS("width", `${initialSecondWidth - 100}px`);
  });
});

test.describe("Size Constraints", () => {
  test(`GIVEN a resizable content with minWidth
      WHEN dragged below minimum
      THEN should not resize below minimum`, async ({ page }) => {
    const d = await setup(page, "hero");
    const content = d.getContentAt(0);
    const { min } = await d.getContentConstraints(content);

    await d.dragHandleBy(d.getHandle(), -200, 0);
    await expect(content).toHaveCSS("width", `${min}px`);
  });

  test(`GIVEN a resizable content with maxWidth
      WHEN dragged above maximum
      THEN should not resize above maximum`, async ({ page }) => {
    const d = await setup(page, "hero");
    const content = d.getContentAt(0);
    const { max } = await d.getContentConstraints(content);

    await d.dragHandleBy(d.getHandle(), 500, 0);
    await expect(content).toHaveCSS("width", `${max}px`);
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
      THEN contents should resize vertically`, async ({ page }) => {
    const d = await setup(page, "vertical");
    const content = d.getContentAt(0);
    const initialHeight = await d.getContentSize(content);

    await d.dragHandleBy(d.getHandle(), 0, 20);
    await expect(content).toHaveCSS("height", `${initialHeight + 20}px`);
  });
});

test.describe("Collapsible Contents", () => {
  test(`GIVEN a collapsible content
      WHEN dragged below collapse threshold
      THEN should collapse to collapsedSize`, async ({ page }) => {
    const d = await setup(page, "collapsible");
    const content = d.getContentAt(0);
    const { threshold, collapsed } = await d.getContentConstraints(content);

    await d.dragHandleBy(d.getHandle(), -(threshold * 2000), 0);

    expect(await d.isContentCollapsed(content)).toBe(true);
    await expect(content).toHaveCSS("width", `${collapsed}px`);
  });

  test(`GIVEN a collapsed content
      WHEN dragged to expand
      THEN should expand and fire callback`, async ({ page }) => {
    const d = await setup(page, "collapsible");
    const content = d.getContentAt(0);

    await d.dragHandleBy(d.getHandle(), -200, 0);
    expect(await d.isContentCollapsed(content)).toBe(true);

    await d.dragHandleBy(d.getHandle(), 200, 0);
    expect(await d.isContentCollapsed(content)).toBe(false);
  });
});

test.describe("Keyboard Navigation", () => {
  test(`GIVEN a horizontal resizable
      WHEN arrow keys are pressed
      THEN should resize by step`, async ({ page }) => {
    const d = await setup(page, "hero");
    const content = d.getContentAt(0);
    const handle = d.getHandle();
    const initialSize = await d.getContentSize(content);

    await handle.focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(100);
    const size = await d.getContentSize(content);

    expect(size).toBeGreaterThan(initialSize);
  });

  test(`GIVEN a resizable
      WHEN Shift+Arrow is pressed
      THEN should resize by larger step`, async ({ page }) => {
    const d = await setup(page, "hero");
    const content = d.getContentAt(0);
    const handle = d.getHandle();
    const initialSize = await d.getContentSize(content);

    await handle.focus();
    await page.keyboard.press("Shift+ArrowRight");
    await page.waitForTimeout(100);
    const size = await d.getContentSize(content);

    expect(size).toBeGreaterThan(initialSize);
  });

  test(`GIVEN a resizable
      WHEN Home/End keys are pressed
      THEN should collapse/expand to limits`, async ({ page }) => {
    const d = await setup(page, "hero");
    const content = d.getContentAt(0);
    const handle = d.getHandle();
    const { min, max } = await d.getContentConstraints(content);

    await handle.focus();
    await page.keyboard.press("Home");
    await expect(content).toHaveCSS("width", `${min}px`);

    await page.keyboard.press("End");
    await expect(content).toHaveCSS("width", `${max}px`);
  });
});

test.describe("Callbacks", () => {
  test(`GIVEN a content with onResize$
    WHEN resized
    THEN callback should fire with new size`, async ({ page }) => {
    const d = await setup(page, "callback");

    const waitForLog = new Promise((resolve) => {
      page.on("console", (msg) => {
        if (msg.text().includes("Left content size:")) {
          resolve(msg.text());
        }
      });
    });

    await d.dragHandleBy(d.getHandle(), 100, 0);

    const logMessage = await waitForLog;
    expect(logMessage).toContain("Left content size:");
    expect(logMessage).toContain("300px");
  });

  test(`GIVEN a collapsible content with callbacks
    WHEN collapsed/expanded
    THEN callbacks should fire`, async ({ page }) => {
    const d = await setup(page, "collapsible");

    const waitForCollapse = new Promise((resolve) => {
      page.on("console", (msg) => {
        if (msg.text() === "Content collapsed") {
          resolve(true);
        }
      });
    });

    const waitForExpand = new Promise((resolve) => {
      page.on("console", (msg) => {
        if (msg.text() === "Content expanded") {
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
      THEN contents should not resize`, async ({ page }) => {
    const d = await setup(page, "disabled");
    const content = d.getContentAt(0);
    const initialSize = await d.getContentSize(content);

    expect(await d.isRootDisabled()).toBe(true);
    await d.dragHandleBy(d.getHandle(), 100, 0);

    await expect(content).toHaveCSS("width", `${initialSize}px`);
  });

  test(`GIVEN a disabled resizable
      WHEN using keyboard navigation
      THEN contents should not resize`, async ({ page }) => {
    const d = await setup(page, "disabled");
    const content = d.getContentAt(0);
    const handle = d.getHandle();
    const initialSize = await d.getContentSize(content);

    await handle.focus();
    await page.keyboard.press("ArrowRight");

    await expect(content).toHaveCSS("width", `${initialSize}px`);
  });
});
