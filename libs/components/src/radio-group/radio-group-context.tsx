import { createContextId, type Signal } from '@builder.io/qwik';

export interface RadioGroupContext {
  selectedValueSig: Signal<string | null>;
  isDisabledSig: Signal<boolean | undefined>;
  isErrorSig: Signal<boolean | undefined>;
  localId: string;
  isDescription: boolean | undefined;
  name: string | undefined;
  required: boolean | undefined;
  value: string | undefined;
  triggerRef: Signal<HTMLButtonElement | undefined>;
  isCheckedSig: Signal<boolean>;
}

export const radioGroupContextId =
  createContextId<RadioGroupContext>('radioGroupContext');
