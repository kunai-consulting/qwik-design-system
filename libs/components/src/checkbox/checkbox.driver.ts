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
    return rootLocator.locator("[data-qds-checkbox-indicator]");
  };

  const getLabel = () => {
    return rootLocator.locator("[data-qds-checkbox-label]");
  };

  const getHiddenInput = () => {
    return rootLocator.locator("[data-qds-checkbox-hidden-input]");
  };

  const getError = () => {
    return rootLocator.locator("[data-qds-checkbox-error]");
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getIndicator,
    getTrigger,
    getLabel,
    getHiddenInput,
    getError
  };
}
