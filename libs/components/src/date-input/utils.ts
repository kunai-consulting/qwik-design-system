import type { DateFormat, LocalDate, Separator } from "../calendar/types";
import { MIN_YEAR, MAX_YEAR } from "./constants";
import type { DateSegment } from "./types";

export const getLocalDate = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` as LocalDate;
};

export const getSeparatorFromFormat = (format?: DateFormat): Separator => {
  if (format?.includes("/")) return "/";
  if (format?.includes("-")) return "-";
  if (format?.includes(".")) return ".";
  return "/";
};

export const getSegmentsFromFormat = (
  format: DateFormat,
  separator: Separator
): DateSegment[] => {
  const segments = format.split(separator);
  return segments.map((segment) => {
    const type = segment.includes("y") ? "year" : segment.includes("d") ? "day" : "month";
    return {
      placeholderText: segment,
      type,
      isPlaceholder: true,
      min: type === "year" ? MIN_YEAR : 1,
      max: type === "year" ? MAX_YEAR : type === "month" ? 12 : 31
    } as DateSegment;
  });
};
