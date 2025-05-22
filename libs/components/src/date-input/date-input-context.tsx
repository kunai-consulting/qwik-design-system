import { type Signal, createContextId } from "@builder.io/qwik";

export const dateInputContextId = createContextId<DateInputContext>(
  "qds-date-input-context"
);

export type DateInputContext = {
  localId: string;
  segmentRefs: Signal<Signal<HTMLInputElement | undefined>[]>; // for focus management
};
