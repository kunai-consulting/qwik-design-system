import type { Locator, Page } from "@playwright/test";

type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-menu-root]");
  };

  const getTrigger = () => {
    return rootLocator.locator("[data-qds-menu-trigger]");
  };

  const getContextTrigger = () => {
    return rootLocator.locator("[data-qds-menu-context-trigger]");
  };

  const getContent = () => {
    return rootLocator.locator("[data-qds-menu-content]");
  };

  const getItems = () => {
    return getContent().locator("[data-qds-menu-item]");
  };

  const getItemByText = (text: string) => {
    return getContent().locator("[data-qds-menu-item]", { hasText: text });
  };

  const getSubmenuTrigger = () => {
    return rootLocator.locator("[data-qds-menu-submenu-trigger]");
  };

  const getSubmenuContent = () => {
    return rootLocator.locator("[data-qds-menu-submenu-content]");
  };

  const getSubmenuItems = () => {
    return getSubmenuContent().locator("[data-qds-menu-item]");
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
