import { type QRL, type Signal, createContextId } from "@builder.io/qwik";
import type {
  DateFormat,
  ISODate,
  LocalDate,
  Locale,
  Separator
} from "../calendar/types";
import type { DateSegment } from "./types";

export const dateInputContextId = createContextId<DateInputContext>(
  "qds-date-input-context"
);

export type DateInputContext = {
  locale: Locale;
  defaultDate?: ISODate;
  activeDateSig: Signal<LocalDate | null>;
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
  activeSegmentIndex: Signal<number>;
  focusNextSegment$: QRL<() => void>;
};
