import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-slider-root]");
  };

  const getTrack = () => {
    return rootLocator.locator("[data-qds-slider-track]");
  };

  const getRange = () => {
    return rootLocator.locator("[data-qds-slider-range]");
  };

  const getThumb = (type?: 'start' | 'end') => {
    if (type) {
      return rootLocator.locator(`[data-qds-slider-thumb][data-thumb-type="${type}"]`);
    }
    return rootLocator.locator("[data-qds-slider-thumb]").first();
  };

  const getTooltip = (type?: 'start' | 'end') => {
    if (type) {
      return rootLocator
        .locator(`[data-qds-slider-thumb][data-thumb-type="${type}"]`)
        .locator("[data-qds-slider-tooltip]");
    }
    return rootLocator.locator("[data-qds-slider-tooltip]").first();
  };

  const getMarks = () => {
    return rootLocator.locator("[data-qds-slider-mark]");
  };

  const getAllThumbs = () => {
    return rootLocator.locator("[data-qds-slider-thumb]");
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getTrack,
    getRange,
    getThumb,
    getTooltip,
    getMarks,
    getAllThumbs
  };
}
