import { component$, PropsOf, useContext, useSignal } from '@builder.io/qwik';
import { OTPContextId } from './otp-context';

type OTPProps = {
  _index?: number;
} & PropsOf<'input'>;

export const OtpItem = component$(({ _index, ...props }: OTPProps) => {
  const context = useContext(OTPContextId);
  const inputRef = useSignal<HTMLInputElement>();
  const isFocused = useSignal(false);

  if (_index === undefined) {
    throw new Error(
      'Qwik UI: Otp Item must have an index. This is a bug in Qwik UI'
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        {...props}
        type="text"
        data-qui-otp-item={_index}
        data-highlighted={
          context.activeIndexSig.value === _index ? '' : undefined
        }
        value={context.value.value[_index]}
        size={1}
        onFocus$={() => {
          isFocused.value = true;
          context.nativeInputRef.value?.focus();
        }}
        maxLength={1}
        readOnly
      />
    </>
  );
});
