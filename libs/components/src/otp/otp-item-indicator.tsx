import { type PropsOf, Slot, component$, useComputed$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { OTPContextId } from "./otp-context";
import { itemContextId } from "./otp-item";

/** Component that renders a caret for OTP input focus indication */
export const OtpItemIndicator = component$(({ ...props }: PropsOf<"span">) => {
  const itemContext = useContext(itemContextId);
  const context = useContext(OTPContextId);

  const isHighlighted = useComputed$(() => {
    return context.currentIndex.value === itemContext.index && context.isFocused.value;
  });

  const isEmpty = useComputed$(() => {
    return !context.code.value[itemContext.index];
  });

  const isVisible = useComputed$(() => {
    return isHighlighted.value && isEmpty.value;
  });

  return (
    // The identifier for the OTP caret element with its specific index
    <Render {...props} fallback="span" data-qds-otp-caret={itemContext.index}>
      {isVisible.value && <Slot />}
    </Render>
  );
});
