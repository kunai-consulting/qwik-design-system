import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-resizable-root]");
  };

  const getHandle = (index = 0) => {
    return rootLocator.locator("[data-qds-resizable-handle]").nth(index);
  };

  const getContentAt = (index: number) => {
    return rootLocator.locator("[data-qds-resizable-content]").nth(index);
  };

  const getHandleAt = (index: number) => {
    return rootLocator.locator("[data-qds-resizable-handle]").nth(index);
  };

  const isContentCollapsed = async (content: Locator) => {
    return (await content.getAttribute("data-is-collapsed")) === "true";
  };

  const getContentSize = async (content: Locator) => {
    const orientation = await getRoot().getAttribute("data-orientation");
    const rect = await content.evaluate((el) => el.getBoundingClientRect());
    return orientation === "vertical" ? rect.height : rect.width;
  };

  const isHandleDisabled = async (handle: Locator) => {
    return (await handle.getAttribute("data-disabled")) === "true";
  };

  const isRootDisabled = async () => {
    return (await getRoot().getAttribute("data-disabled")) !== null;
  };

  const getOrientation = async () => {
    return (await getRoot().getAttribute("data-orientation")) as
      | "horizontal"
      | "vertical";
  };

  const getContentConstraints = async (content: Locator) => {
    return {
      min: Number(await content.getAttribute("data-min-size")) || 0,
      max: Number(await content.getAttribute("data-max-size")) || 1000,
      collapsed: Number(await content.getAttribute("data-collapsed-size")) || 0,
      threshold: Number(await content.getAttribute("data-collapse-threshold")) || 0
    };
  };

  const dragHandleBy = async (handle: Locator, dx: number, dy: number) => {
    const orientation = await getOrientation();
    const box = await handle.boundingBox();
    if (!box) return;

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    const endX = startX + (orientation === "horizontal" ? dx : 0);
    const endY = startY + (orientation === "vertical" ? dy : 0);

    const page = handle.page();
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY, { steps: 10 });
    await page.mouse.up();

    await page.waitForTimeout(100);
  };

  const getHandleAriaValues = async (handle: Locator) => {
    return {
      min: Number(await handle.getAttribute("aria-valuemin")),
      max: Number(await handle.getAttribute("aria-valuemax")),
      now: Number(await handle.getAttribute("aria-valuenow")),
      orientation: await handle.getAttribute("aria-orientation")
    };
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getHandle,
    getContentAt,
    getHandleAt,
    isContentCollapsed,
    getContentSize,
    isHandleDisabled,
    isRootDisabled,
    getOrientation,
    getContentConstraints,
    dragHandleBy,
    getHandleAriaValues
  };
}
