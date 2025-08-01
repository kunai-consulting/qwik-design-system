import { type QwikJSX, type Signal, createContextId } from "@qwik.dev/core";
import type { ISODate } from "../calendar/types";
import type { DateSegment } from "./types";

export const dateInputFieldContextId = createContextId<DateInputFieldContext>(
  "qds-date-input-field-context"
);

export type DateInputFieldContext = {
  dateSig: Signal<ISODate | null>;
  dayOfMonthSegmentSig: Signal<DateSegment>;
  monthSegmentSig: Signal<DateSegment>;
  yearSegmentSig: Signal<DateSegment>;
  fieldId: string;
  name?: string;
  required?: boolean;
  value?: string;
  disabledSig: Signal<boolean>;
  isInternalSegmentClearance: Signal<boolean>;
  separator?: string | QwikJSX.Element;
};
