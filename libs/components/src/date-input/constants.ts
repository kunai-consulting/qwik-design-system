import type { DateSegment } from "./types";

export const MIN_YEAR = 0;
export const MAX_YEAR = 10000;
export const MIN_MONTH = 1;
export const MAX_MONTH = 12;
export const MIN_DAY = 1;
export const MAX_DAY = 31;
export const DEFAULT_DAY_OF_MONTH_SEGMENT: DateSegment = {
  placeholderText: "dd",
  type: "day",
  isPlaceholder: true,
  min: MIN_DAY,
  max: MAX_DAY,
  numericValue: undefined,
  isoValue: undefined
};
export const DEFAULT_MONTH_SEGMENT: DateSegment = {
  placeholderText: "mm",
  type: "month",
  isPlaceholder: true,
  min: MIN_MONTH,
  max: MAX_MONTH,
  numericValue: undefined,
  isoValue: undefined
};
export const DEFAULT_YEAR_SEGMENT: DateSegment = {
  placeholderText: "yyyy",
  type: "year",
  isPlaceholder: true,
  min: MIN_YEAR,
  max: MAX_YEAR,
  numericValue: undefined,
  isoValue: undefined
};
