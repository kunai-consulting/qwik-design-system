import type { DateFormat, ISODate, LocalDate, Separator } from "../calendar/types";
import { MAX_YEAR, MIN_YEAR } from "./constants";
import type { DateSegment } from "./types";

export const getLocalDate = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` as LocalDate;
};

export const getISODate = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` as ISODate;
};

export const getSeparatorFromFormat = (format?: DateFormat): Separator => {
  if (format?.includes("/")) return "/";
  if (format?.includes("-")) return "-";
  if (format?.includes(".")) return ".";
  return "/";
};

export const getSegmentsFromFormat = (
  format: DateFormat,
  separator: Separator,
  defaultDate?: ISODate
): DateSegment[] => {
  const sections = format.split(separator);
  const placeholderSegments = sections.map((segment) => {
    const type = segment.includes("y") ? "year" : segment.includes("d") ? "day" : "month";
    return {
      placeholderText: segment,
      type,
      isPlaceholder: true,
      min: type === "year" ? MIN_YEAR : 1,
      max: type === "year" ? MAX_YEAR : type === "month" ? 12 : 31
    } as DateSegment;
  });
  if (defaultDate) {
    const [year, month, day] = defaultDate.split("-");
    return placeholderSegments.map((segment) => {
      const type = segment.type;
      return {
        ...segment,
        isPlaceholder: false,
        numericValue: type === "year" ? +year : type === "month" ? +month : +day,
        displayValue: type === "year" ? year : type === "month" ? month : day,
        max: type === "day" ? getLastDayOfMonth(+year, +month) : segment.max
      } as DateSegment;
    });
  }
  return placeholderSegments;
};

export const getLastDayOfMonth = (year: number, month: number) => {
  // The Date constructor month is 0-indexed, but we can use our 1-based month value along with the 0 day value,
  // which 'underflows' to the last day of the target month
  return new Date(year, month, 0).getDate();
};
