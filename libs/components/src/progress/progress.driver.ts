import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-progress-root]");
  };

  const getLabel = () => {
    return rootLocator.locator("[data-qds-progress-label]");
  };

  const getTrack = () => {
    return rootLocator.locator("[data-qds-progress-track]");
  };

  const getProgressIndicator = () => {
    return rootLocator.locator("[data-qds-progress-indicator]");
  };

  const getProgressState = () => {
    return getProgressIndicator().getAttribute("data-progress");
  };

  const getProgressValue = () => {
    return getProgressIndicator().getAttribute("data-value");
  };

  return {
    ...rootLocator,
    getRoot,
    getLabel,
    getTrack,
    getProgressIndicator,
    getProgressState,
    getProgressValue
  };
}
