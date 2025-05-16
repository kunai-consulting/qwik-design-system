import type { Locator, Page } from "@playwright/test";

type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-dropdown-root]");
  };

  const getTrigger = () => {
    return rootLocator.locator("[data-qds-dropdown-trigger]");
  };

  const getContextTrigger = () => {
    return rootLocator.locator("[data-qds-dropdown-context-trigger]");
  };

  const getContent = () => {
    return rootLocator.locator("[data-qds-dropdown-content]");
  };

  const getItems = () => {
    return getContent().locator("[data-qds-dropdown-item]");
  };

  const getItemByText = (text: string) => {
    return getContent().locator("[data-qds-dropdown-item]", { hasText: text });
  };

  const getSubmenuTrigger = () => {
    return rootLocator.locator("[data-qds-dropdown-submenu-trigger]");
  };

  const getSubmenuContent = () => {
    return rootLocator.locator("[data-qds-dropdown-submenu-content]");
  };

  const getSubmenuItems = () => {
    return getSubmenuContent().locator("[data-qds-dropdown-item]");
  };

  const rightClickOn = async (locator: Locator, position?: { x: number; y: number }) => {
    await locator.click({
      button: "right",
      position: position || undefined
    });
  };

  return {
    locator: rootLocator,
    getRoot,
    getTrigger,
    getContextTrigger,
    getContent,
    getItems,
    getItemByText,
    getSubmenuTrigger,
    getSubmenuContent,
    getSubmenuItems,
    rightClickOn
  };
}
