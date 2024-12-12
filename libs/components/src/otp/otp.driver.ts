import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-otp-root]");
  };

  const getItems = () => {
    return rootLocator.locator("[data-qds-otp-item]");
  };

  const getInput = () => {
    return rootLocator.locator("[data-qds-otp-native-input]");
  };

  const getItemAt = (index: number) => {
    return rootLocator.locator(`[data-qds-otp-item="${index}"]`);
  };

  const getHighlightedItem = () => {
    return rootLocator.locator("[data-highlighted]");
  };

  const getCaretAt = (index: number) => {
    return rootLocator.locator(`[data-qds-otp-caret="${index}"]`);
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getItems,
    getInput,
    getItemAt,
    getCaretAt,
    getHighlightedItem
  };
}
