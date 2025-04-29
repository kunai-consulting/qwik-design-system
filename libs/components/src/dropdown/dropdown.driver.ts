import type { Locator, Page } from "@playwright/test";

type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-dropdown-root]");
  };

  const getTrigger = () => {
    // Ensure we target the trigger within the specific root if rootLocator is used
    const base = rootLocator === getRoot() ? getRoot() : rootLocator;
    return base.locator("[data-qds-dropdown-trigger]");
  };

  const getContent = () => {
    // Content might be attached elsewhere (portal), so search from the page level if needed
    // Or assume it's findable globally or within a common test container
    const page = "page" in rootLocator ? rootLocator.page() : rootLocator;
    return page.locator("[data-qds-dropdown-content]");
  };

  const getItems = () => {
    return getContent().locator("[data-qds-dropdown-item]");
  };

  const getItemByText = (text: string) => {
    return getContent().locator("[data-qds-dropdown-item]", { hasText: text });
  };

  return {
    locator: rootLocator,
    getRoot,
    getTrigger,
    getContent,
    getItems,
    getItemByText
  };
}
