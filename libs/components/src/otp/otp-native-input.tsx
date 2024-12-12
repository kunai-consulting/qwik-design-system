// File: otp-native-input.tsx
import { component$, type PropsOf, useContext } from "@builder.io/qwik";
import { OTPContextId } from "./otp-context";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";

interface OtpNativeInputProps extends PropsOf<"input"> {}

export const OtpNativeInput = component$((props: OtpNativeInputProps) => {
  const context = useContext(OTPContextId);

  return (
    <input
      {...props}
      ref={context.nativeInputRef}
      data-qds-otp-native-input
      type="text"
      value={context.inputValueSig.value}
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete={context.autoComplete || "one-time-code"}
      onFocus$={() => {
        context.isFocusedSig.value = true;
      }}
      onBlur$={() => {
        context.isFocusedSig.value = false;
      }}
      onInput$={(event: InputEvent) => {
        const input = event.target as HTMLInputElement;
        context.inputValueSig.value = input.value;
        context.currIndexSig.value = input.value.length;
      }}
      maxLength={context.numItemsSig.value}
      aria-label="Enter your OTP"
    />
  );
});
