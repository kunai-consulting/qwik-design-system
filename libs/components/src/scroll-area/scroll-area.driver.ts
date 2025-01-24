import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-scroll-area-root]");
  };

  const getViewport = () => {
    return rootLocator.locator("[data-qds-scroll-area-viewport]");
  };

  const getVerticalScrollbar = () => {
    return rootLocator.locator(
      '[data-qds-scroll-area-scrollbar][data-orientation="vertical"]'
    );
  };

  const getHorizontalScrollbar = () => {
    return rootLocator.locator(
      '[data-qds-scroll-area-scrollbar][data-orientation="horizontal"]'
    );
  };

  const getVerticalThumb = () => {
    return getVerticalScrollbar().locator("[data-qds-scroll-area-thumb]");
  };

  const getHorizontalThumb = () => {
    return getHorizontalScrollbar().locator("[data-qds-scroll-area-thumb]");
  };

  const getViewportAttributes = async () => {
    const viewport = getViewport();
    return {
      tabIndex: await viewport.getAttribute("tabindex"),
      role: await viewport.getAttribute("role"),
      ariaLabel: await viewport.getAttribute("aria-label")
    };
  };

  const getScrollbarState = async () => {
    const scrollbar = getVerticalScrollbar();
    return scrollbar.getAttribute("data-state");
  };

  const getScrollAreaType = () => {
    return getRoot().getAttribute("data-type");
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
    getViewportAttributes,
    getScrollbarState,
    getScrollAreaType
  };
}
