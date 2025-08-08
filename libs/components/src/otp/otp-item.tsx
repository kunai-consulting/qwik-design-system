import {
  type PropsOf,
  Slot,
  component$,
  createContextId,
  useComputed$,
  useContext,
  useContextProvider,
  useId,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { OTPContextId } from "./otp-context";
type PublicOTPProps = PropsOf<"div">;
export const itemContextId = createContextId<{
  index: number;
}>("qd-otp-item");
/** Individual item component for displaying a single OTP digit */
export const OtpItem = component$((props: PublicOTPProps) => {
  const context = useContext(OTPContextId);
  const itemId = useId();

  useTask$(() => {
    context.itemIds.value = [...context.itemIds.value, itemId];
  });

  const currItemIndex = useComputed$(() => context.itemIds.value.indexOf(itemId));

  const itemRef = useSignal<HTMLInputElement>();

  useContextProvider(itemContextId, { index: currItemIndex.value });

  const itemValue = useComputed$(() => {
    const idx = currItemIndex.value;
    return idx >= 0 ? context.code.value[idx] || "" : "";
  });

  const isHighlighted = useComputed$(() => {
    if (!context.isFocused.value) {
      return false;
    }

    const value = context.code.value;

    const start = context.selectionStart.value;
    const end = context.selectionEnd.value;
    const idx = currItemIndex.value;
    if (start !== null && end !== null && start !== end) {
      return idx >= start && idx < end;
    }

    return idx === context.currIndex.value && !value[idx];
  });

  return (
    <div
      {...props}
      ref={itemRef}
      // The identifier for individual OTP input items with their index
      data-qds-otp-item={currItemIndex.value}
      // Indicates if the OTP item is currently highlighted
      data-highlighted={isHighlighted.value ? "" : undefined}
      // Indicates if the OTP item is disabled
      data-disabled={context.isDisabled.value ? "" : undefined}
    >
      {itemValue.value}
      <Slot />
    </div>
  );
});
