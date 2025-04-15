export type DateSegment = {
  numericValue?: number;
  displayValue?: string;
  placeholderText: string;
  type: "month" | "day" | "year";
  isPlaceholder: boolean;
  min: number;
  max: number;
};
