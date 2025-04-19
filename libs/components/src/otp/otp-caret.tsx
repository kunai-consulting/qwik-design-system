import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { OTPContextId } from "./otp-context";
import { itemContextId } from "./otp-item";

/** Component that renders a caret for OTP input focus indication */
export const OtpCaret = component$(({ ...props }: PropsOf<"span">) => {
  const itemContext = useContext(itemContextId);
  const context = useContext(OTPContextId);
  const isHighlighted =
    context.currIndexSig.value === itemContext.index && context.isFocusedSig.value;
  const isEmpty = !context.inputValueSig.value[itemContext.index];
  const showCaret = isHighlighted && isEmpty;

  return (
    // The identifier for the OTP caret element with its specific index
    <span {...props} data-qds-otp-caret={itemContext.index}>
      {showCaret && <Slot />}
    </span>
  );
});
