import { type Locator, type Page, expect } from "@playwright/test";
type OpenKeys = "Space" | "Enter";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-collapsible]");
  };

  const getTrigger = () => {
    return getRoot().getByRole("button");
  };

  const getContent = () => {
    return getRoot().locator("[data-qds-collapsible-content]");
  };

  const openCollapsible = async (key: OpenKeys | "click") => {
    await getTrigger().focus();

    if (key !== "click") {
      await getTrigger().press(key);
    } else {
      await getTrigger().click();
    }

    // should be open initially
    await expect(getContent()).toBeVisible();
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getTrigger,
    getContent,
    openCollapsible
  };
}
