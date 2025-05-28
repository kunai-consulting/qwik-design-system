import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-checklist-root]");
  };

  const getMainCheckbox = () => {
    return rootLocator.locator("[data-qds-checklist-select-all]");
  };

  const getMainTrigger = () => {
    return rootLocator.locator("[data-qds-checklist-select-all-trigger]");
  };

  const getMainIndicator = () => {
    return rootLocator.locator("[data-qds-checklist-select-all-indicator]");
  };

  const getItemAt = (index: number) => {
    return rootLocator.locator("[data-qds-checkbox-root]").nth(index);
  };

  const getTriggerAt = (index: number) => {
    return rootLocator.locator("[data-qds-checkbox-trigger]").nth(index);
  };

  const getIndicatorAt = (index: number) => {
    return rootLocator.locator("[data-qds-checkbox-indicator]").nth(index);
  };

  const getLabelAt = (index: number) => {
    return rootLocator.locator("[data-qds-checkbox-label]").nth(index);
  };

  const getHiddenInput = () => {
    return rootLocator.locator("[data-qds-checkbox-hidden-input]");
  };

  const getError = () => {
    return rootLocator.locator("[data-qds-checkbox-error]");
  };

  const getSubmitButton = () => {
    return rootLocator.locator(".submit-button");
  };

  const getSubmittedData = () => {
    return rootLocator.locator(".submitted-data");
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
    getError,
    getMainCheckbox,
    getMainTrigger,
    getMainIndicator,
    getSubmitButton,
    getSubmittedData
  };
}
