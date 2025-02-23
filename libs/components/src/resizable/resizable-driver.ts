import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-resizable-root]");
  };

  const getHandle = () => {
    return rootLocator.locator("[data-qds-resizable-handle]");
  };

  const getPanel = () => {
    return rootLocator.locator("[data-qds-resizable-panel]");
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getHandle,
    getPanel,
  };
}
