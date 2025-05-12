import type { PropsOf } from "@builder.io/qwik";

export type DateSegmentType = "month" | "day" | "year";

export type DateSegment = {
  numericValue?: number;
  displayValue?: string;
  isoValue?: string;
  placeholderText: string;
  type: DateSegmentType;
  isPlaceholder: boolean;
  min: number;
  max: number;
};

export type PublicDateInputSegmentProps = PropsOf<"input"> & {
  placeholder?: string;
  showLeadingZero?: boolean;
};