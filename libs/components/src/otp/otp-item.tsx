import {
  type PropsOf,
  Slot,
  component$,
  createContextId,
  useComputed$,
  useConstant,
  useContext,
  useContextProvider,
  useSignal
} from "@qwik.dev/core";
import { OTPContextId } from "./otp-context";
type PublicOTPProps = PropsOf<"div">;
export const itemContextId = createContextId<{
  index: number;
}>("qd-otp-item");
/** Individual item component for displaying a single OTP digit */
export const OtpItem = component$((props: PublicOTPProps) => {
  const context = useContext(OTPContextId);

  const currItemIndex = useConstant(() => {
    const index = context.currItemIndex;
    context.numItems++;
    context.currItemIndex++;
    return index;
  });

  const itemRef = useSignal<HTMLInputElement>();
  useContextProvider(itemContextId, { index: currItemIndex });
  const itemValue = context.inputValueSig.value[currItemIndex] || "";

  const isHighlightedSig = useComputed$(() => {
    if (!context.isFocusedSig.value) {
      return false;
    }

    const value = context.inputValueSig.value;

    const start = context.selectionStartSig.value;
    const end = context.selectionEndSig.value;
    if (start !== null && end !== null && start !== end) {
      return currItemIndex >= start && currItemIndex < end;
    }

    const isHighlighted =
      currItemIndex === context.currIndexSig.value && !value[currItemIndex];

    return isHighlighted;
  });

  if (currItemIndex === undefined) {
    throw new Error("Qwik UI: Otp Item must have an index. This is a bug in Qwik UI");
  }

  return (
    <div
      {...props}
      ref={itemRef}
      // The identifier for individual OTP input items with their index
      data-qds-otp-item={currItemIndex}
      // Indicates if the OTP item is currently highlighted
      data-highlighted={isHighlightedSig.value ? "" : undefined}
      // Indicates if the OTP item is disabled
      data-disabled={context.isDisabledSig.value ? "" : undefined}
    >
      {itemValue}
      <Slot />
    </div>
  );
});
