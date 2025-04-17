import { type Signal, createContextId } from "@builder.io/qwik";
import type { DateFormat, LocalDate, Locale, Month, Separator } from "../calendar/types";
import type { DateSegment } from "./types";

export const dateInputContextId = createContextId<DateInputContext>(
  "qds-date-input-context"
);

export type DateInputContext = {
  locale: Locale;
  defaultDate: LocalDate;
  activeDate: Signal<LocalDate | null>;
  maxDayOfMonth: Signal<number>;
  monthToRender: Signal<Month>;
  yearToRender: Signal<number>;
  dayOfMonthSegmentSig: Signal<DateSegment>;
  monthSegmentSig: Signal<DateSegment>;
  yearSegmentSig: Signal<DateSegment>;
  orderedSegments: Signal<DateSegment>[];
  separator: Separator;
  currentDate: LocalDate;
  errorMessage?: string;
  localId: string;
  name?: string;
  required?: boolean;
  value?: string;
  format: DateFormat;
};
