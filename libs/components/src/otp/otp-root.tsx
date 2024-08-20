import {
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useSignal,
} from '@builder.io/qwik';
import { findComponent, processChildren } from '../../utils/inline-component';
import { OTPContextId } from './otp-context';
import { OtpItem } from './otp-item';

type OtpRootProps = PropsOf<'div'> & {
  _numItems?: number;
};

export const OtpRoot = ({ children }: OtpRootProps) => {
  let currItemIndex = 0;
  let numItems = 0;

  findComponent(OtpItem, (itemProps) => {
    itemProps._index = currItemIndex;
    currItemIndex++;
    numItems = currItemIndex;
  });

  processChildren(children);

  return <OtpBase _numItems={numItems}>{children}</OtpBase>;
};

export const OtpBase = component$((props: OtpRootProps) => {
  const value = useSignal<string>('');
  const activeIndex = useSignal(0);
  const nativeInputRef = useSignal<HTMLInputElement>();
  const numItemsSig = useComputed$(() => props._numItems || 0);

  const fullEntrySig = useComputed$(
    () => value.value.length === numItemsSig.value
  );

  const context = {
    value: value,
    activeIndexSig: activeIndex,
    nativeInputRef: nativeInputRef,
    numItemsSig,
    fullEntrySig,
  };

  useContextProvider(OTPContextId, context);
  return (
    <div {...props}>
      <Slot />
    </div>
  );
});
