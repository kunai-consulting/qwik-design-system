import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-qr-code-root]");
  };

  const getFrame = () => {
    return rootLocator.locator("[data-qds-qr-code-frame]");
  };

  const getSvg = () => {
    return rootLocator.locator("[data-qds-qr-pattern-svg]").first();
  };

  const getPath = () => {
    return rootLocator.locator("[data-qds-qr-pattern-path]").first();
  };

  const getOverlay = () => {
    return rootLocator.locator("[data-qds-qr-overlay] img").first();
  };

  const getAllSvgs = () => {
    return rootLocator.locator("[data-qds-qr-pattern-svg]");
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getFrame,
    getSvg,
    getPath,
    getOverlay,
    getAllSvgs
  };
}
