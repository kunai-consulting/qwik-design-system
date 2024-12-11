import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { OTPContextId } from "./otp-context";
import { itemContextId } from "./otp-item";

export const OtpCaret = component$(({ ...props }: PropsOf<"span">) => {
  const itemContext = useContext(itemContextId);
  const context = useContext(OTPContextId);
  const showCaret =
    context.activeIndexSig.value === itemContext.index && context.isFocusedSig.value;

  return (
    <span {...props} data-qds-otp-caret={itemContext.index}>
      {showCaret && <Slot />}
    </span>
  );
});
