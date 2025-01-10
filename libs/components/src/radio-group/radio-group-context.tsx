import { createContextId, type Signal } from '@builder.io/qwik';

export const radioGroupContextId = createContextId<RadioGroupContext>(
  'qds-radio-group-context'
);

export type RadioGroupContext = {
  selectedValueSig: Signal<string | undefined>;
  selectedIndexSig: Signal<number | null>;
  isDisabledSig: Signal<boolean | undefined>;
  isErrorSig: Signal<boolean | undefined>;
  localId: string;
  isDescription: boolean | undefined;
  name: string | undefined;
  required: boolean | undefined;
  value: string | undefined;
  triggerRef: Signal<HTMLButtonElement | undefined>;
};
