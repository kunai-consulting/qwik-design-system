import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { OTPContextId } from "./otp-context";
import { itemContextId } from "./otp-item";

export const OtpCaret = component$(({ ...props }: PropsOf<"span">) => {
  const itemContext = useContext(itemContextId);
  const context = useContext(OTPContextId);
  const isHighlighted =
    context.currIndexSig.value === itemContext.index && context.isFocusedSig.value;
  const isEmpty = !context.inputValueSig.value[itemContext.index];
  const showCaret = isHighlighted && isEmpty;

  return (
    <span {...props} data-qds-otp-caret={itemContext.index}>
      {showCaret && <Slot />}
    </span>
  );
});
