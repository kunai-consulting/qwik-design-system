import type { Page } from "@playwright/test";

export const createTestDriver = (page: Page) => {
  return {
    getRoot: () => page.locator("[data-qds-toaster-root]"),
    getTrigger: () => page.locator("[data-qds-toaster-trigger]"),
    getToastItem: (index: number) => page.locator("[data-qds-toaster-item]").nth(index),
    getAllToastItems: () => page.locator("[data-qds-toaster-item]"),
    getToastItemTitle: (index: number) =>
      page
        .locator("[data-qds-toaster-item]")
        .nth(index)
        .locator("[data-qds-toaster-item-title]"),
    getToastItemDescription: (index: number) =>
      page
        .locator("[data-qds-toaster-item]")
        .nth(index)
        .locator("[data-qds-toaster-item-description]"),
    getToastItemClose: (index: number) =>
      page
        .locator("[data-qds-toaster-item]")
        .nth(index)
        .locator("[data-qds-toaster-item-close]")
  };
};
