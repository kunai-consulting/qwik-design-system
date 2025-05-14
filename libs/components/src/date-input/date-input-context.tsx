import { type Signal, createContextId } from "@builder.io/qwik";
import type { ISODate } from "../calendar/types";
import type { DateSegment } from "./types";

export const dateInputContextId = createContextId<DateInputContext>(
  "qds-date-input-context"
);

export type DateInputContext = {
  dateSig: Signal<ISODate | null>;
  dayOfMonthSegmentSig: Signal<DateSegment>;
  monthSegmentSig: Signal<DateSegment>;
  yearSegmentSig: Signal<DateSegment>;
  localId: string;
  errorMessage?: string;
  name?: string;
  required?: boolean;
  value?: string;
  disabledSig: Signal<boolean>;
  isInternalSegmentClearance: Signal<boolean>;
  segmentRefs: Signal<Signal<HTMLInputElement | undefined>[]>; // for focus management
};
