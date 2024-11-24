import { createContextId, JSXNode, type Signal } from "@builder.io/qwik";

export const checkboxContextId = createContextId<CheckboxContext>("qds-checkbox-context");

export type CheckboxContext = {
  isCheckedSig: Signal<boolean | "mixed">;
  isDisabledSig: Signal<boolean | undefined>;
  isErrorSig: Signal<boolean | undefined>;
  localId: string;
  isDescription: boolean | undefined;
  name: string | undefined;
  required: boolean | undefined;
  value: string | undefined;
  triggerRef: Signal<HTMLButtonElement | undefined>;
};
