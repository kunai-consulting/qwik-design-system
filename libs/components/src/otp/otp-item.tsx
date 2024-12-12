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

interface ItemContextType {
  index: number;
}
type OTPProps = {
  _index?: number;
} & PropsOf<"div">;

export const itemContextId = createContextId<ItemContextType>("qd-otp-item");
export const OtpItem = component$(({ _index = 0, ...props }: OTPProps) => {
  const context = useContext(OTPContextId);
  const itemRef = useSignal<HTMLInputElement>();
  useContextProvider(itemContextId, { index: _index });
  const itemValue = context.inputValueSig.value[_index] || "";
  const isLastItemSig = useComputed$(() => _index === context.numItemsSig.value - 1);

  if (_index === undefined) {
    throw new Error("Qwik UI: Otp Item must have an index. This is a bug in Qwik UI");
  }

  return (
    <div
      {...props}
      ref={itemRef}
      data-qds-otp-item={_index}
      data-highlighted={
        (context.isFocusedSig.value && context.currIndexSig.value === _index) ||
        (isLastItemSig.value &&
          context.isLastItemSig.value &&
          !context.isFocusedSig.value === false)
          ? ""
          : undefined
      }
    >
      {itemValue}
      <Slot />
    </div>
  );
});
