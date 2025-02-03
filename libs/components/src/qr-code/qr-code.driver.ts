import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-qr-code-root]");
  };

  const getSvg = () => {
    return rootLocator.locator("[data-qds-qr-pattern]").first();
  };

  const getBackgroundRect = () => {
    return rootLocator.locator("[data-qds-qr-pattern] rect").first();
  };

  const getQRCodeRects = () => {
    return rootLocator.locator("[data-qds-qr-pattern] g rect");
  };

  const getOverlay = () => {
    return rootLocator.locator("[data-qds-qr-overlay] img").first();
  };

  const getAllSvgs = () => {
    return rootLocator.locator("[data-qds-qr-pattern]");
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getSvg,
    getBackgroundRect,
    getQRCodeRects,
    getOverlay,
    getAllSvgs
  };
}
