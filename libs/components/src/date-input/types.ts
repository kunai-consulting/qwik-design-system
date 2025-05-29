import type { PropsOf } from "@builder.io/qwik";

export type DateSegmentType = "month" | "day" | "year";

export type DateSegment = {
  numericValue?: number;
  isoValue?: string;
  placeholderText: string;
  type: DateSegmentType;
  isPlaceholder: boolean;
  min: number;
  max: number;
  maxLength: number;
};

export type PublicDateInputSegmentProps = PropsOf<"input"> & {
  _index?: number;
  placeholder?: string;
  showLeadingZero?: boolean;
};
