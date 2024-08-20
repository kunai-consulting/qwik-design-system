import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { OTPContextId } from "./otp-context";
import { itemContextId } from "./otp-item";

export const OtpCaret = component$(({ ...props }: PropsOf<"span">) => {
  const itemContext = useContext(itemContextId);
  const context = useContext(OTPContextId);
  const showCaret = context.activeIndexSig.value === itemContext.index;

  return <span {...props}>{showCaret && <Slot />}</span>;
});
