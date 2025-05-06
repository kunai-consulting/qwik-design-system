import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-toaster-root]");
  };

  const getTrigger = () => {
    return rootLocator.locator("[data-qds-toast-trigger]");
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getTrigger
  };
}
