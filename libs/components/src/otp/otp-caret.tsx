import { component$, PropsOf, Slot, useContext } from '@builder.io/qwik';
import { itemContextId } from './otp-item';
import { OTPContextId } from './otp-context';

export const OtpCaret = component$(({ ...props }: PropsOf<'span'>) => {
  const itemContext = useContext(itemContextId);
  const context = useContext(OTPContextId);
  const showCaret = context.activeIndexSig.value === itemContext.index;

  return <span {...props}>{showCaret && <Slot />}</span>;
});
