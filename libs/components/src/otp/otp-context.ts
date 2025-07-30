import { type Signal, createContextId } from "@qwik.dev/core";

export interface OTPContext {
  inputValueSig: Signal<string>;
  currIndexSig: Signal<number | null>;
  nativeInputRef: Signal<HTMLInputElement | undefined>;
  numItems: number;
  isFocusedSig: Signal<boolean>;
  isDisabledSig: Signal<boolean | undefined>;
  selectionStartSig: Signal<number | null>;
  selectionEndSig: Signal<number | null>;
  shiftPWManagers: boolean;
  currItemIndex: number;
}

export const OTPContextId = createContextId<OTPContext>("OTPContext");
