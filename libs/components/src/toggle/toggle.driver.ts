import type { Locator, Page } from "@playwright/test";

export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-toggle]");
  };

  const getIndicator = () => {
    return getRoot().locator("[data-qds-toggle-indicator]");
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getIndicator
  };
}
