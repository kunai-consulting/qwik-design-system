import type { Locator, Page } from "@playwright/test";

type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-tooltip-root]");
  };

  const getTrigger = () => {
    return rootLocator.locator("[data-qds-tooltip-trigger]");
  };

  const getContent = () => {
    return rootLocator.locator("[data-qds-tooltip-content]");
  };

  const getArrow = () => {
    return rootLocator.locator("[data-qds-tooltip-arrow]");
  };

  return {
    locator: rootLocator,
    getRoot,
    getTrigger,
    getContent,
    getArrow
  };
}
