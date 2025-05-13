import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getToast = () => {
    return rootLocator.locator("[data-qds-toast-content]");
  };

  const getToastTitle = () => {
    return rootLocator.locator("[data-qds-toast-title]");
  };

  const getToastDescription = () => {
    return rootLocator.locator("[data-qds-toast-description]");
  };

  const getToastClose = () => {
    return rootLocator.locator("[data-qds-toast-close]");
  };

  const openToast = async () => {
    const toast = getToast();
    await expect(toast).toBeVisible();
    return toast;
  };

  const closeToast = async () => {
    const close = getToastClose();
    await close.click();
    const toast = getToast();
    await expect(toast).not.toBeVisible();
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getToast,
    getToastTitle,
    getToastDescription,
    getToastClose,
    openToast,
    closeToast
  };
}
