import { type Signal, createContextId } from "@builder.io/qwik";
import type { ISODate } from "../calendar/types";
import type { DateSegment } from "./types";

export const dateInputDateEntryContextId = createContextId<DateInputDateEntryContext>(
  "qds-date-input-date-entry-context"
);

export type DateInputDateEntryContext = {
  dateSig: Signal<ISODate | null>;
  dayOfMonthSegmentSig: Signal<DateSegment>;
  monthSegmentSig: Signal<DateSegment>;
  yearSegmentSig: Signal<DateSegment>;
  entryId: string;
  name?: string;
  required?: boolean;
  value?: string;
  disabledSig: Signal<boolean>;
  isInternalSegmentClearance: Signal<boolean>;
};
