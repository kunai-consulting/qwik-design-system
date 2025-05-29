import { type Signal, createContextId } from "@builder.io/qwik";
import type { ISODate } from "../calendar/types";
import type { DateSegment } from "./types";

export const dateInputEntryContextId = createContextId<DateInputEntryContext>(
  "qds-date-input-entry-context"
);

export type DateInputEntryContext = {
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
