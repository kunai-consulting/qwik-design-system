import { type ReadonlySignal, type Signal, createContextId } from "@qwik.dev/core";

type TriggerRef = {
  ref: Signal;
  value: string | undefined;
};

export interface RadioGroupContext {
  selectedValueSig: Signal<string | undefined>;
  isDisabledSig: Signal<boolean> | ReadonlySignal<boolean>;
  isErrorSig: Signal<boolean>;
  localId: string;
  required?: boolean;
  name?: string;
  orientation: "horizontal" | "vertical";
  isDescription?: boolean;
  triggerRefsArray: Signal<TriggerRef[]>;
}

export const radioGroupContextId =
  createContextId<RadioGroupContext>("radio-group-context");
