import type { Locator, Page } from "@playwright/test";

type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-dropdown-root]");
  };

  const getTrigger = () => {
    return rootLocator.locator("[data-qds-dropdown-trigger]");
  };

  const getContent = () => {
    return rootLocator.locator("[data-qds-dropdown-content]");
  };

  const getItems = () => {
    return getContent().locator("[data-qds-dropdown-item]");
  };

  const getItemByText = (text: string) => {
    return getContent().locator("[data-qds-dropdown-item]", { hasText: text });
  };

  return {
    locator: rootLocator,
    getRoot,
    getTrigger,
    getContent,
    getItems,
    getItemByText
  };
}
