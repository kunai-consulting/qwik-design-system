import { type QRL, type Signal, createContextId } from "@builder.io/qwik";
import type { ISODate, Locale } from "../calendar/types";
import type { DateSegment } from "./types";

export const dateInputContextId = createContextId<DateInputContext>(
  "qds-date-input-context"
);

export type DateInputContext = {
  locale: Locale;
  dateSig: Signal<ISODate | null>;
  dayOfMonthSegmentSig: Signal<DateSegment>;
  monthSegmentSig: Signal<DateSegment>;
  yearSegmentSig: Signal<DateSegment>;
  // separator: Separator;
  errorMessage?: string;
  localId: string;
  name?: string;
  required?: boolean;
  value?: string;
  // format: DateFormat;
  disabledSig: Signal<boolean>;
  
  // TODO: remove these deprecated properties
  orderedSegments: Signal<DateSegment>[];
  activeSegmentIndex: Signal<number>;
  
  // Focus management
  segmentRefs: Signal<Signal<HTMLInputElement | undefined>[]>;
  focusableSegments: Signal<HTMLInputElement[]>;
  registerFocusableSegment$: QRL<(element: HTMLInputElement, type: "day" | "month" | "year") => void>;
  focusNextSegment$: QRL<(currentElement: HTMLInputElement) => void>;
  focusPreviousSegment$: QRL<(currentElement: HTMLInputElement) => void>;
  
  isInternalSegmentClearance: Signal<boolean>;
};
