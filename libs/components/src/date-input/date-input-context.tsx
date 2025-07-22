import { type Signal, createContextId } from "@qwik.dev/core";
import type { ISODate } from "../calendar/types";

export const dateInputContextId = createContextId<DateInputContext>(
  "qds-date-input-context"
);

export type DateInputContext = {
  localId: string;
  segmentRefs: Signal<Signal<HTMLInputElement | undefined>[]>; // for focus management
  datesSig: Signal<(ISODate | null)[]>;
};
