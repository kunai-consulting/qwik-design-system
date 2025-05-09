import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-date-input-root]");
  };

  const getLabel = () => {
    return rootLocator.locator("[data-qds-date-input-label]");
  };

  const getDateEntry = () => {
    return rootLocator.locator("[data-qds-date-input-date-entry]");
  };

  const getSegments = () => {
    return rootLocator.locator("[data-qds-date-input-segment]");
  };

  const getYearSegment = () => {
    return rootLocator.locator("[data-qds-date-input-segment-year]");
  };

  const getMonthSegment = () => {
    return rootLocator.locator("[data-qds-date-input-segment-month]");
  };

  const getDaySegment = () => {
    return rootLocator.locator("[data-qds-date-input-segment-day]");
  };

  const getSeparators = () => {
    return rootLocator.locator("[data-qds-date-input-separator]");
  };

  const getHiddenInput = () => {
    return rootLocator.locator("[data-qds-date-input-hidden-input]");
  };

  const getErrorMessage = () => {
    return rootLocator.locator("[data-qds-date-input-error-message]");
  };

  const getSubmitButton = () => {
    return rootLocator.locator(".submit-button");
  };

  const getSubmittedData = () => {
    return rootLocator.locator(".submitted-data");
  };

  const getExternalValue = () => {
    return rootLocator.locator(".external-value");
  };

  const getSetValueButton = () => {
    return rootLocator.locator(".set-value-button");
  };

  const getSetNullButton = () => {
    return rootLocator.locator(".set-null-button");
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getLabel,
    getDateEntry,
    getSegments,
    getYearSegment,
    getMonthSegment,
    getDaySegment,
    getSeparators,
    getHiddenInput,
    getErrorMessage,
    getSubmitButton,
    getSubmittedData,
    getExternalValue,
    getSetValueButton,
    getSetNullButton
  };
}
