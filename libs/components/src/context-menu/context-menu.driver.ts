import type { Locator, Page } from "@playwright/test";

type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-context-menu-root]");
  };

  const getTrigger = () => {
    return rootLocator.locator("[data-qds-context-menu-trigger]");
  };

  const getContent = () => {
    return rootLocator.locator("[data-qds-context-menu-content]");
  };

  const getItems = () => {
    return getContent().locator("[data-qds-context-menu-item]");
  };

  const getItemByText = (text: string) => {
    return getContent().locator("[data-qds-context-menu-item]", { hasText: text });
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
