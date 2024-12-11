// File: otp-native-input.tsx
import { component$, type PropsOf, useContext } from "@builder.io/qwik";
import { OTPContextId } from "./otp-context";

interface OtpNativeInputProps extends PropsOf<"input"> {}

export const OtpNativeInput = component$((props: OtpNativeInputProps) => {
  const context = useContext(OTPContextId);

  return (
    <input
      {...props}
      ref={context.nativeInputRef}
      type="text"
      data-qui-otp-native-input
      value={context.value.value}
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="one-time-code"
      onFocus$={() => {
        context.isFocusedSig.value = true;
      }}
      onBlur$={() => {
        context.isFocusedSig.value = false;
      }}
      onInput$={(event: InputEvent) => {
        const input = event.target as HTMLInputElement;
        context.value.value = input.value;
        context.activeIndexSig.value = input.value.length;
      }}
      maxLength={context.numItemsSig.value}
      aria-label="Enter your OTP"
    />
  );
});
