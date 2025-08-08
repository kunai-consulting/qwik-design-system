import { type Signal, createContextId } from "@qwik.dev/core";

export interface OTPContext {
  code: Signal<string>;
  currentIndex: Signal<number | null>;
  nativeInputRef: Signal<HTMLInputElement | undefined>;
  isFocused: Signal<boolean>;
  isDisabled: Signal<boolean | undefined>;
  selectionStart: Signal<number | null>;
  selectionEnd: Signal<number | null>;
  shiftPWManagers: boolean;
  hasBeenFocused: Signal<boolean>;
  numItems: number;
}

export const OTPContextId = createContextId<OTPContext>("OTPContext");
