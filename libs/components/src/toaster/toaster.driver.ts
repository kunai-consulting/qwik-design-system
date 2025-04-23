import type { Page, Locator } from "@playwright/test";

// Driver definition based on Playwright Page
export function createDriver(page: Page) {
  const getViewport = () => page.locator("[data-toaster]");

  const getToastItems = () => getViewport().locator("[data-toast-item]");

  const getToastById = (id: string) =>
    getViewport().locator(`#${CSS.escape(id)}[data-toast-item]`);

  // Example: Might need locators for specific parts within a toast later
  const getToastTitle = (toastLocator: Locator) =>
    toastLocator.locator("[data-toast-title]");
  const getToastDescription = (toastLocator: Locator) =>
    toastLocator.locator("[data-toast-description]");
  const getToastCloseButton = (toastLocator: Locator) =>
    toastLocator.locator("[data-toast-close]");

  return {
    page,
    getViewport,
    getToastItems,
    getToastById,
    // Methods to interact with specific parts (examples)
    getToastTitle,
    getToastDescription,
    getToastCloseButton
    // Add more specific interaction helpers as needed for tests
  };
}

export type ToasterDriver = ReturnType<typeof createDriver>;
