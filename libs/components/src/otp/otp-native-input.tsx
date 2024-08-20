// File: otp-native-input.tsx
import { component$, useContext } from '@builder.io/qwik';
import { OTPContextId } from './otp-context';

export const OtpNativeInput = component$(() => {
  const context = useContext(OTPContextId);

  return (
    <input
      ref={context.nativeInputRef}
      type="text"
      data-qui-otp-native-input
      value={context.value.value}
      inputMode="numeric"
      pattern="[0-9]*"
      onInput$={(event: InputEvent) => {
        const input = event.target as HTMLInputElement;
        context.value.value = input.value;
        context.activeIndexSig.value = input.value.length;
      }}
      maxLength={context.numItemsSig.value}
      aria-label="Enter your OTP"
      class="invisible"
    />
  );
});
