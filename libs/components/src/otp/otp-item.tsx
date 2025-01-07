import {
  type PropsOf,
  Slot,
  component$,
  createContextId,
  useComputed$,
  useContext,
  useContextProvider,
  useSignal
} from "@builder.io/qwik";
import { OTPContextId } from "./otp-context";

type OTPProps = {
  _index?: number;
} & PropsOf<"div">;

export const itemContextId = createContextId<{ index: number }>("qd-otp-item");
/** Individual item component for displaying a single OTP digit */
export const OtpItem = component$(({ _index = 0, ...props }: OTPProps) => {
  const context = useContext(OTPContextId);
  const itemRef = useSignal<HTMLInputElement>();
  useContextProvider(itemContextId, { index: _index });
  const itemValue = context.inputValueSig.value[_index] || "";

  const isHighlightedSig = useComputed$(() => {
    if (!context.isFocusedSig.value) {
      return false;
    }

    const value = context.inputValueSig.value;

    const start = context.selectionStartSig.value;
    const end = context.selectionEndSig.value;
    if (start !== null && end !== null && start !== end) {
      return _index >= start && _index < end;
    }

    return _index === context.currIndexSig.value && !value[_index];
  });

  if (_index === undefined) {
    throw new Error("Qwik UI: Otp Item must have an index. This is a bug in Qwik UI");
  }

  return (
    <div
      {...props}
      ref={itemRef}
      // The identifier for individual OTP input items with their index
      data-qds-otp-item={_index}
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
