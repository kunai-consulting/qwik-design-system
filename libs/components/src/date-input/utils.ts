import type { DateFormat, ISODate, Separator } from "../calendar/types";
import {
  DEFAULT_DAY_OF_MONTH_SEGMENT,
  DEFAULT_MONTH_SEGMENT,
  DEFAULT_YEAR_SEGMENT
} from "./constants";

export const getSeparatorFromFormat = (format?: DateFormat): Separator => {
  if (format?.includes("/")) return "/";
  if (format?.includes("-")) return "-";
  if (format?.includes(".")) return ".";
  return "/";
};

export const getInitialSegments = (initialDate: ISODate | null) => {
  if (!initialDate) {
    return {
      dayOfMonthSegment: DEFAULT_DAY_OF_MONTH_SEGMENT,
      monthSegment: DEFAULT_MONTH_SEGMENT,
      yearSegment: DEFAULT_YEAR_SEGMENT
    };
  }

  const [year, month, day] = initialDate.split("-");
  return {
    dayOfMonthSegment: {
      ...DEFAULT_DAY_OF_MONTH_SEGMENT,
      numericValue: +day,
      displayValue: day,
      isoValue: day,
      max: getLastDayOfMonth(+year, +month),
      isPlaceholder: false
    },
    monthSegment: {
      ...DEFAULT_MONTH_SEGMENT,
      numericValue: +month,
      displayValue: month,
      isoValue: month,
      isPlaceholder: false
    },
    yearSegment: {
      ...DEFAULT_YEAR_SEGMENT,
      numericValue: +year,
      displayValue: year,
      isoValue: year,
      isPlaceholder: false
    }
  };
};

export const getLastDayOfMonth = (year: number, month: number) => {
  // The Date constructor month is 0-indexed, but we can use our 1-based month value along with the 0 day value,
  // which 'underflows' to the last day of the target month
  return new Date(year, month, 0).getDate();
};

export const getDisplayValue = (
  numericValue: number | undefined,
  placeholderText: string
) => {
  if (numericValue === undefined) return undefined;
  if (placeholderText.length === 2 && numericValue < 10) {
    return `0${numericValue}`;
  }
  return `${numericValue}`;
};

/**
 * Pads a numeric value with a leading zero if it is less than 10.
 * Used for formatting month and day values to be two digits, consistent with ISO date format.
 * @param numericValue The numeric value to pad
 * @returns The padded numeric value
 */
export const getTwoDigitPaddedValue = (numericValue: number | undefined) => {
  if (numericValue === undefined) return undefined;
  if (numericValue < 10) {
    return `0${numericValue}`;
  }
  return `${numericValue}`;
};
