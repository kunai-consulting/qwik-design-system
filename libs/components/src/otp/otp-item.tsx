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
export const OtpItem = component$(({ _index = 0, ...props }: OTPProps) => {
  const context = useContext(OTPContextId);
  const itemRef = useSignal<HTMLInputElement>();
  useContextProvider(itemContextId, { index: _index });
  const itemValue = context.inputValueSig.value[_index] || "";
  const isLastItemSig = useComputed$(() => _index === context.numItemsSig.value - 1);

  const isHighlightedSig = useComputed$(() => {
    if (!context.isFocusedSig.value) {
      return false;
    }

    const start = context.selectionStartSig.value;
    const end = context.selectionEndSig.value;

    // Check if current index is within selection range
    if (start !== null && end !== null) {
      return _index >= start && _index < end;
    }

    // Fallback to current index highlighting
    return context.currIndexSig.value === _index;
  });

  const isLastItemHighlightedSig = useComputed$(
    () => isLastItemSig.value && context.isLastItemSig.value && context.isFocusedSig.value
  );

  if (_index === undefined) {
    throw new Error("Qwik UI: Otp Item must have an index. This is a bug in Qwik UI");
  }

  return (
    <div
      {...props}
      ref={itemRef}
      data-qds-otp-item={_index}
      data-highlighted={
        isHighlightedSig.value || isLastItemHighlightedSig.value ? "" : undefined
      }
    >
      {itemValue}
      <Slot />
    </div>
  );
});
