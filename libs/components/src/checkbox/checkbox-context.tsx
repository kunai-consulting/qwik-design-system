import { createContextId, JSXNode, type Signal } from "@builder.io/qwik";

export const checkboxContextId = createContextId<CheckboxContext>("qds-checkbox-context");

export type CheckboxContext = {
  isCheckedSig: Signal<boolean | "mixed">;
  isDisabledSig: Signal<boolean | undefined>;
  localId: string;
  description: string | JSXNode | undefined;
};
