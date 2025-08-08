import { type Signal, createContextId } from "@qwik.dev/core";

export interface OTPContext {
  code: Signal<string>;
  currIndex: Signal<number | null>;
  nativeInputRef: Signal<HTMLInputElement | undefined>;
  /** Ordered list of item keys for the current render pass */
  itemIds: Signal<string[]>;
  isFocused: Signal<boolean>;
  isDisabled: Signal<boolean | undefined>;
  selectionStart: Signal<number | null>;
  selectionEnd: Signal<number | null>;
  shiftPWManagers: boolean;
  hasBeenFocused: Signal<boolean>;
}

export const OTPContextId = createContextId<OTPContext>("OTPContext");
