import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-toaster-root]");
  };

  const getTrigger = () => {
    return rootLocator.locator("[data-qds-toaster-trigger]");
  };

  const getItem = () => {
    return rootLocator.locator("[data-qds-toaster-item]");
  };

  const getClose = () => {
    return rootLocator.locator("[data-qds-toaster-item-close]");
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getTrigger,
    getItem,
    getClose
  };
}
