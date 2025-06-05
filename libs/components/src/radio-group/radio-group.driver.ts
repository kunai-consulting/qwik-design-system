import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-radio-group-root]");
  };

  const getIndicator = () => {
    return rootLocator.locator("[data-qds-indicator]");
  };

  const getItemAt = (index: number) => {
    return rootLocator.locator("[data-qds-radio-group-item]").nth(index);
  };

  const getIndicatorAt = (index: number) => {
    return rootLocator.locator("[data-qds-indicator]").nth(index);
  };

  const getLabelAt = (index: number) => {
    return rootLocator.locator("[data-qds-radio-group-label]").nth(index);
  };

  const getTriggerAt = (index: number) => {
    return rootLocator.locator("[data-qds-radio-group-trigger]").nth(index);
  };

  const getError = () => {
    return rootLocator.locator("[data-qds-radio-group-error]");
  };

  const getDescription = () => {
    return rootLocator.locator("[data-qds-radio-group-description]");
  };

  const isEnabled = async (trigger: Locator) => {
    return !(await trigger.getAttribute("data-disabled"));
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getItemAt,
    getIndicatorAt,
    getLabelAt,
    getTriggerAt,
    getError,
    getDescription,
    getIndicator,
    isEnabled
  };
}
