import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-scroll-area-root]");
  };

  const getViewport = () => {
    return rootLocator.locator("[data-scroll-area-viewport]");
  };

  const getVerticalScrollbar = () => {
    return rootLocator.locator(
      '[data-scroll-area-scrollbar][data-orientation="vertical"]'
    );
  };

  const getHorizontalScrollbar = () => {
    return rootLocator.locator(
      '[data-scroll-area-scrollbar][data-orientation="horizontal"]'
    );
  };

  const getVerticalThumb = () => {
    return getVerticalScrollbar().locator("[data-scroll-area-thumb]");
  };

  const getHorizontalThumb = () => {
    return getHorizontalScrollbar().locator("[data-scroll-area-thumb]");
  };

  const getViewportAttributes = async () => {
    const viewport = getViewport();
    return {
      tabIndex: await viewport.getAttribute("tabindex"),
      role: await viewport.getAttribute("role"),
      ariaLabel: await viewport.getAttribute("aria-label")
    };
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getViewport,
    getVerticalScrollbar,
    getHorizontalScrollbar,
    getVerticalThumb,
    getHorizontalThumb,
    getViewportAttributes
  };
}
