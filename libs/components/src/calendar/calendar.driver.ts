import type { Locator, Page } from "@playwright/test";
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getRoot = () => {
    return rootLocator.locator("[data-qds-calendar-root]");
  };

  const getLabel = () => {
    return rootLocator.locator("[data-qds-calendar-label]");
  };

  const getDateField = () => {
    return rootLocator.locator("[data-qds-calendar-field]");
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

  const getSetValueButton = () => {
    return rootLocator.locator(".set-value-button");
  };

  const getCalendarGrid = () => {
    return rootLocator.locator("[data-qds-calendar-grid]");
  };

  const getCalendarGridDayButtons = () => {
    return rootLocator.locator("[data-qds-calendar-grid-day-button]");
  };

  const getTrigger = () => {
    return rootLocator.locator("[data-qds-calendar-trigger]");
  };

  const getOpenStatus = () => {
    return rootLocator.locator("[data-qds-calendar-test-open-status]");
  };

  const getExternalToggle = () => {
    return rootLocator.locator("[data-qds-calendar-test-external-toggle]");
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
    getSetValueButton,
    getCalendarGrid,
    getCalendarGridDayButtons,
    getTrigger,
    getOpenStatus,
    getExternalToggle
  };
}
