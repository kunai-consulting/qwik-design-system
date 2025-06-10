import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-toast-root]");
  };

  const getContent = () => {
    return rootLocator.locator("[data-qds-toast-content]");
  };

  const getTitle = () => {
    return rootLocator.locator("[data-qds-toast-title]");
  };

  const getDescription = () => {
    return rootLocator.locator("[data-qds-toast-description]");
  };

  const getClose = () => {
    return rootLocator.locator("[data-qds-toast-close]");
  };

  const getTrigger = () => {
    return rootLocator.locator(".toast-trigger");
  };

  const openToast = async () => {
    const trigger = getTrigger();
    await trigger.click();
    const content = getContent();
    await expect(content).toBeVisible();
    return { content };
  };

  const closeToast = async () => {
    const close = getClose();
    await close.click();
    await expect(getContent()).not.toBeVisible();
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getContent,
    getTitle,
    getDescription,
    getClose,
    getTrigger,
    openToast,
    closeToast
  };
}
