import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-switch-root]");
  };

  const getControl = () => {
    return rootLocator.locator("[data-qds-switch-control]");
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

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getControl,
    getThumb,
    getLabel,
    getDescription,
    getHiddenInput
  };
}
