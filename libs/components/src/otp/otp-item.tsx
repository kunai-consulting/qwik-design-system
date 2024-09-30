import {
  type PropsOf,
  Slot,
  component$,
  createContextId,
  useComputed$,
  useContext,
  useContextProvider,
  useSignal,
} from '@builder.io/qwik';
import { OTPContextId } from './otp-context';

interface ItemContextType {
  index: number;
}
type OTPProps = {
  _index?: number;
} & PropsOf<'div'>;

export const itemContextId = createContextId<ItemContextType>('qd-otp-item');
export const OtpItem = component$(({ _index = 0, ...props }: OTPProps) => {
  const context = useContext(OTPContextId);
  const itemRef = useSignal<HTMLInputElement>();
  useContextProvider(itemContextId, { index: _index });
  const itemValue = context.value.value[_index] || '';
  const isFullEntry = useComputed$(
    () => _index === context.numItemsSig.value - 1
  );

  if (_index === undefined) {
    throw new Error(
      'Qwik UI: Otp Item must have an index. This is a bug in Qwik UI'
    );
  }

  return (
    <div
      {...props}
      ref={itemRef}
      data-qui-otp-item={_index}
      data-highlighted={
        (context.isFocusedSig.value &&
          context.activeIndexSig.value === _index) ||
        (isFullEntry.value &&
          context.fullEntrySig.value &&
          !context.isFocusedSig.value === false)
          ? ''
          : undefined
      }
      onFocus$={() => {
        context.activeIndexSig.value = _index;
        context.isFocusedSig.value = true;
        context.nativeInputRef.value?.focus();
      }}
    >
      {itemValue}
      <Slot />
    </div>
  );
});
