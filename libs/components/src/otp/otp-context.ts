import { type Signal, createContextId } from "@builder.io/qwik";

export interface OTPContext {
  inputValueSig: Signal<string>;
  currIndexSig: Signal<number>;
  nativeInputRef: Signal<HTMLInputElement | undefined>;
  numItemsSig: Signal<number>;
  isLastItemSig: Signal<boolean>;
  isFocusedSig: Signal<boolean>;
}

export const OTPContextId = createContextId<OTPContext>("OTPContext");
