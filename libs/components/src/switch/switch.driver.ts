import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-switch-root]");
  };

  const getTrigger = () => {
    return rootLocator.locator("[data-qds-switch-trigger]");
  };

  const getThumb = () => {
    return rootLocator.locator("[data-qds-switch-thumb]");
  };

  const getLabel = () => {
    return rootLocator.locator("[data-qds-switch-label]");
  };

  const getDescription = () => {
    return rootLocator.locator("[data-qds-switch-description]");
  };

  const getHiddenInput = () => {
    return rootLocator.locator('input[type="checkbox"]');
  };

  const getError = () => {
    return rootLocator.locator("[data-qds-switch-error]");
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getTrigger,
    getThumb,
    getLabel,
    getDescription,
    getHiddenInput,
    getError
  };
}
