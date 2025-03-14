import {
  type QRL,
  type ReadonlySignal,
  type Signal,
  createContextId
} from "@builder.io/qwik";

export interface RadioGroupContext {
  selectedValueSig: Signal<string | undefined>;
  isDisabledSig: Signal<boolean> | ReadonlySignal<boolean>;
  isErrorSig: Signal<boolean>;
  localId: string;
  required?: boolean;
  name?: string;
  formRef: Signal<HTMLFormElement | undefined>;
  orientation: "horizontal" | "vertical";
  isDescription?: boolean;
  onChange$: QRL<(value: string) => void>;
  registerTrigger$: QRL<(element: Element, index?: number) => void>;
  unregisterTrigger$: QRL<(element: Element) => void>;
}

export const radioGroupContextId =
  createContextId<RadioGroupContext>("radio-group-context");
