import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-qr-code-root]");
  };

  const getSvg = () => {
    return rootLocator.locator("[data-qds-qr-container]").first();
  };

  const getBackgroundRect = () => {
    return rootLocator.locator("[data-qds-qr-container] rect").first();
  };

  const getQRCodeRects = () => {
    return rootLocator.locator("[data-qds-qr-container] g rect");
  };

  const getOverlay = () => {
    return rootLocator.locator("[data-qds-qr-container] image").first();
  };

  const getAllSvgs = () => {
    return rootLocator.locator("[data-qds-qr-container]");
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
