import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-toast-root]");
  };

  const getContent = () => {
    return rootLocator.locator("[data-qds-toast-content]");
  };

  const getRootState = () => {
    return getRoot().getAttribute("data-state");
  };

  const getRootPosition = () => {
    return getRoot().getAttribute("data-position");
  };

  const getContentState = () => {
    return getContent().getAttribute("data-state");
  };

  const getBoundingBox = async () => {
    return getRoot().boundingBox();
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getContent,
    getRootState,
    getRootPosition,
    getContentState,
    getBoundingBox
  };
}
