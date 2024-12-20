import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-checklist-root]");
  };

  const getSelectAll = () => {
    return rootLocator.locator("[data-qds-checklist-select-all]");
  };

  const getSelectAllTrigger = () => {
    return rootLocator.locator("[data-qds-checklist-select-all-trigger]");
  };

  const getSelectAllIndicator = () => {
    return rootLocator.locator("[data-qds-checklist-select-all-indicator]");
  };

  const getItemAt = (index: number) => {
    return rootLocator.locator("[data-qds-checkbox-root]").nth(index);
  };

  const getTriggerAt = (index: number) => {
    return rootLocator.locator("[data-qds-checkbox-trigger]").nth(index);
  };

  const getIndicatorAt = (index: number) => {
    return rootLocator.locator("[data-qds-indicator]").nth(index);
  };

  const getLabelAt = (index: number) => {
    return rootLocator.locator("[data-qds-checkbox-label]").nth(index);
  };

  const getHiddenInput = () => {
    return rootLocator.locator("[data-qds-checkbox-hidden-input]");
  };

  const getErrorMessage = () => {
    return rootLocator.locator("[data-qds-checkbox-error-message]");
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getItemAt,
    getTriggerAt,
    getIndicatorAt,
    getLabelAt,
    getHiddenInput,
    getErrorMessage
  };
}
