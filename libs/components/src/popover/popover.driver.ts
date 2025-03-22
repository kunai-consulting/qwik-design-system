import type { Locator, Page } from "@playwright/test";

export type DriverLocator = Locator | Page;

export type PopoverOpenKeys = "Enter" | "Space";

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getPopover = () => {
    return rootLocator.locator("[popover]");
  };

  const getTrigger = () => {
    return rootLocator.locator("[data-qds-popover-trigger]");
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getPopover,
    getTrigger
  };
}
