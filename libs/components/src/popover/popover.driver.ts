import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export type DriverLocator = Locator | Page;

export type PopoverOpenKeys = "Enter" | "Space";

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getPopover = () => {
    return rootLocator.locator("[popover]");
  };

  const getTrigger = () => {
    return rootLocator.locator("[data-qds-popover-anchor]");
  };

  const openPopover = async (key: PopoverOpenKeys | "click", index?: number) => {
    const action = key === "click" ? "click" : "press";
    const trigger = index !== undefined ? getTrigger().nth(index) : getTrigger();

    const popover = index !== undefined ? getPopover().nth(index) : getPopover();

    if (action === "click") {
      await trigger.click({ position: { x: 0, y: 0 } });
    } else {
      await trigger.press(key);
    }

    await expect(popover).toBeVisible();

    return { trigger, popover };
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getPopover,
    getTrigger,
    openPopover
  };
}
