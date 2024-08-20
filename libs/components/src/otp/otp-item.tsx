import {
  type PropsOf,
  Slot,
  component$,
  createContextId,
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
  const isFocused = useSignal(false);
  useContextProvider(itemContextId, { index: _index });

  const itemValue = context.value.value[_index] || "";

  if (_index === undefined) {
    throw new Error("Qwik UI: Otp Item must have an index. This is a bug in Qwik UI");
  }

  return (
    <div
      {...props}
      ref={itemRef}
      data-qui-otp-item={_index}
      data-highlighted={context.activeIndexSig.value === _index ? "" : undefined}
      onFocus$={() => {
        context.activeIndexSig.value = _index;
        isFocused.value = true;
        context.nativeInputRef.value?.focus();
      }}
    >
      {itemValue}
      <Slot />
    </div>
  );
});
