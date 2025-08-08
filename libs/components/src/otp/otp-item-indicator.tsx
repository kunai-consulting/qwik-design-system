import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { OTPContextId } from "./otp-context";
import { itemContextId } from "./otp-item";

/** Component that renders a caret for OTP input focus indication */
export const OtpItemIndicator = component$(({ ...props }: PropsOf<"span">) => {
  const itemContext = useContext(itemContextId);
  const context = useContext(OTPContextId);
  const isHighlighted =
    context.currentIndex.value === itemContext.index && context.isFocused.value;
  const isEmpty = !context.code.value[itemContext.index];
  const showCaret = isHighlighted && isEmpty;

  return (
    // The identifier for the OTP caret element with its specific index
    <Render {...props} fallback="span" data-qds-otp-caret={itemContext.index}>
      {showCaret && <Slot />}
    </Render>
  );
});
