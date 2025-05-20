import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-tabs-root]");
  };

  const getList = () => {
    return rootLocator.locator("[data-qds-tabs-list]");
  };

  const getTriggerAt = (index: number) => {
    return rootLocator.locator("[data-qds-tabs-trigger]").nth(index);
  };

  const getContentAt = (index: number) => {
    return rootLocator.locator("[data-qds-tabs-content]").nth(index);
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getList,
    getTriggerAt,
    getContentAt
  };
}
