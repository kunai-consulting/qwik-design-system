// File: otp-native-input.tsx
import { $, component$, type PropsOf, useContext, useTask$ } from "@builder.io/qwik";
import { OTPContextId } from "./otp-context";

type OtpNativeInputProps = PropsOf<"input"> & {
  /** Pattern for input validation. Set to null to disable pattern validation. Defaults to "[0-9]*" for numeric input */
  pattern?: string | null;
};

export const OtpHiddenInput = component$((props: OtpNativeInputProps) => {
  const context = useContext(OTPContextId);

  const handleFocus = $(() => {
    context.isFocusedSig.value = true;
  });

  const handleInput = $((event: InputEvent) => {
    const input = event.target as HTMLInputElement;
    context.inputValueSig.value = input.value;
    context.currIndexSig.value = input.value.length;
  });

  const handleBlur = $(() => {
    context.isFocusedSig.value = false;
  });

  return (
    <input
      {...props}
      ref={context.nativeInputRef}
      data-qds-otp-hidden-input
      value={context.inputValueSig.value}
      inputMode="numeric"
      pattern={props.pattern ?? "[0-9]*"}
      autoComplete={props.autoComplete || "one-time-code"}
      onFocus$={[handleFocus, props.onFocus$]}
      onBlur$={[handleBlur, props.onBlur$]}
      onInput$={[handleInput, props.onInput$]}
      maxLength={context.numItemsSig.value}
    />
  );
});
