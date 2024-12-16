import { type QRL, type Signal, createContextId } from "@builder.io/qwik";

export interface OTPContext {
  inputValueSig: Signal<string>;
  currIndexSig: Signal<number | null>;
  nativeInputRef: Signal<HTMLInputElement | undefined>;
  numItemsSig: Signal<number>;
  isLastItemSig: Signal<boolean>;
  isFocusedSig: Signal<boolean>;
  isDisabledSig: Signal<boolean | undefined>;
  selectionStartSig: Signal<number | null>;
  selectionEndSig: Signal<number | null>;
}

export const OTPContextId = createContextId<OTPContext>("OTPContext");
