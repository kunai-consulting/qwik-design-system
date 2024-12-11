import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getItems = () => {
    return rootLocator.locator("[data-qui-otp-item]");
  };

  const getNativeInput = () => {
    return rootLocator.locator("[data-qui-otp-native-input]");
  };

  const getItemByIndex = (index: number) => {
    return rootLocator.locator(`[data-qui-otp-item="${index}"]`);
  };

  const getHighlightedItem = () => {
    return rootLocator.locator("[data-highlighted]");
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getItems,
    getNativeInput,
    getItemByIndex,
    getHighlightedItem
  };
}
