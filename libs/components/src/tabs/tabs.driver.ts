import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-tabs-root]");
  };

  const getList = () => {
    return rootLocator.locator("[data-qds-tabs-list]");
  };

  const getTrigger = () => {
    return rootLocator.locator("[data-qds-tabs-trigger]");
  };

  const getContent = () => {
    return rootLocator.locator("[data-qds-tabs-content]");
  };

  const getIndicator = () => {
    return rootLocator.locator("[data-qds-tabs-indicator]");
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getList,
    getTrigger,
    getContent,
    getIndicator
  };
}
