import type { Locator, Page } from "@playwright/test";

export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-toast-root]");
  };

  const getContent = () => {
    return rootLocator.locator("[data-qds-toast-content]");
  };

  const getTitle = () => {
    return rootLocator.locator("[data-qds-toast-title]");
  };

  const getDescription = () => {
    return rootLocator.locator("[data-qds-toast-description]");
  };

  const getClose = () => {
    return rootLocator.locator("[data-qds-toast-close]");
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getContent,
    getTitle,
    getDescription,
    getClose
  };
}
