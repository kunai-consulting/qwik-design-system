import type { DateSegment } from "./types";

export const MIN_YEAR = 0;
export const MAX_YEAR = 10000;
export const MIN_MONTH = 1;
export const MAX_MONTH = 12;
export const MIN_DAY = 1;
export const DEFAULT_DAY_OF_MONTH_SEGMENT: DateSegment = {
  placeholderText: "dd",
  type: "day",
  isPlaceholder: true,
  min: 1,
  max: 31,
  numericValue: undefined,
  isoValue: undefined
};
export const DEFAULT_MONTH_SEGMENT: DateSegment = {
  placeholderText: "mm",
  type: "month",
  isPlaceholder: true,
  min: 1,
  max: 12,
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
