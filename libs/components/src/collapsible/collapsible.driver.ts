import { type Locator, expect, type Page } from "@playwright/test";
type OpenKeys = "Space" | "Enter";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-collapsible]");
  };

  const getTrigger = () => {
    return getRoot().getByRole("button");
  };

  const getContent = () => {
    return getRoot().locator("[data-collapsible-content]");
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
