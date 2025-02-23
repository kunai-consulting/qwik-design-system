import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-resizable-root]");
  };

  const getHandle = () => {
    return rootLocator.locator("[data-qds-resizable-handle]");
  };

  const getPanelAt = (index: number) => {
    return rootLocator.locator("[data-qds-resizable-panel]").nth(index);
  };

  // For when we have multiple handles
  const getHandleAt = (index: number) => {
    return rootLocator.locator("[data-qds-resizable-handle]").nth(index);
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getHandle,
    getPanelAt,
    getHandleAt,
  };
}
