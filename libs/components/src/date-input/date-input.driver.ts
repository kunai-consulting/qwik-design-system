import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-date-input-root]");
  };

  const getLabel = () => {
    return rootLocator.locator("[data-qds-date-input-label]");
  };

  const getDateField = () => {
    return rootLocator.locator("[data-qds-date-input-field]");
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

  const getHiddenInput = () => {
    return rootLocator.locator("[data-qds-date-input-hidden-input]");
  };

  const getError = () => {
    return rootLocator.locator("[data-qds-date-input-error]");
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

  const getToggleDisabledButton = () => {
    return rootLocator.locator(".toggle-disabled-button");
  };

  const getFirstEntry = () => {
    return rootLocator.locator(
      '[data-qds-date-input-field][data-qds-date-input-field-index="0"]'
    );
  };

  const getSecondEntry = () => {
    return rootLocator.locator(
      '[data-qds-date-input-field][data-qds-date-input-field-index="1"]'
    );
  };

  const getFirstYearSegment = () => {
    return getFirstEntry().locator("[data-qds-date-input-segment-year]");
  };
  const getFirstMonthSegment = () => {
    return getFirstEntry().locator("[data-qds-date-input-segment-month]");
  };
  const getFirstDaySegment = () => {
    return getFirstEntry().locator("[data-qds-date-input-segment-day]");
  };
  const getFirstHiddenInput = () => {
    return getFirstEntry().locator('input[name="departure-date"]');
  };

  const getSecondYearSegment = () => {
    return getSecondEntry().locator("[data-qds-date-input-segment-year]");
  };
  const getSecondMonthSegment = () => {
    return getSecondEntry().locator("[data-qds-date-input-segment-month]");
  };
  const getSecondDaySegment = () => {
    return getSecondEntry().locator("[data-qds-date-input-segment-day]");
  };
  const getSecondHiddenInput = () => {
    return getSecondEntry().locator('input[name="return-date"]');
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getRoot,
    getLabel,
    getDateField,
    getSegments,
    getYearSegment,
    getMonthSegment,
    getDaySegment,
    getHiddenInput,
    getError,
    getSubmitButton,
    getSubmittedData,
    getExternalValue,
    getSetValueButton,
    getSetNullButton,
    getToggleDisabledButton,
    // Getters for range date entries
    getFirstEntry,
    getSecondEntry,
    getFirstYearSegment,
    getFirstMonthSegment,
    getFirstDaySegment,
    getFirstHiddenInput,
    getSecondYearSegment,
    getSecondMonthSegment,
    getSecondDaySegment,
    getSecondHiddenInput
  };
}
