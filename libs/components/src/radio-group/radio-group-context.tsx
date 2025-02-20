import { type Signal, createContextId } from "@qwik.dev/core";

export const radioGroupContextId = createContextId<RadioGroupContext>(
  "qds-radio-group-context"
);

export type RadioGroupContext = {
  selectedValueSig: Signal<string | undefined>;
  selectedIndexSig: Signal<number | null>;
  isDisabledSig: Signal<boolean | undefined>;
  isErrorSig: Signal<boolean | undefined>;
  localId: string;
  isDescription: boolean | undefined;
  required: boolean | undefined;
  value: string | undefined;
  triggerRef: Signal<HTMLButtonElement | undefined>;
};
