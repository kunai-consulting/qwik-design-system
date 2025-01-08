import type { Locator, Page } from '@playwright/test';
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator('[data-qds-radio-group-root]');
  };

  const getMainIndicator = () => {
    return rootLocator.locator('[data-qds-indicator]');
  };

  const getItemAt = (index: number) => {
    return rootLocator.locator('[data-qds-radio-group-item]').nth(index);
  };

  const getIndicatorAt = (index: number) => {
    return rootLocator.locator('[data-qds-indicator]').nth(index);
  };

  const getLabelAt = (index: number) => {
    return rootLocator.locator('[data-qds-radio-group-label]').nth(index);
  };

  const getInputAt = (index: number) => {
    return rootLocator
      .locator('[data-qds-radio-group-input][name="hero"]')
      .nth(index);
  };

  const getErrorMessage = () => {
    return rootLocator.locator('[data-qds-radio-group-error-message]');
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getItemAt,
    getIndicatorAt,
    getLabelAt,
    getInputAt,
    getErrorMessage,
    getMainIndicator,
  };
}
