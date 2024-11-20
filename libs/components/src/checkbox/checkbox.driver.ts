import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-checkbox-root]");
  };

  const getTrigger = () => {
    return rootLocator.locator("[data-qds-checkbox-trigger]");
  };

  const getIndicator = () => {
    return rootLocator.locator("[data-qds-indicator]");
  };

  const getLabel = () => {
    return rootLocator.locator("[data-qds-checkbox-label]");
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getIndicator,
    getTrigger,
    getLabel
  };
}
