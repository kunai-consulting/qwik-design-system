import {
  type PropsOf,
  type Signal,
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

type ItemContext = {
  index: Signal<number>;
};

export const itemContextId = createContextId<ItemContext>("qd-otp-item");

/** Individual item component for displaying a single OTP digit */
export const OtpItem = component$((props: PublicOTPProps) => {
  const context = useContext(OTPContextId);
  const itemId = useId();
  const index = useSignal(0);

  useTask$(() => {
    context.itemIds.value = [...context.itemIds.value, itemId];
    index.value = context.itemIds.value.indexOf(itemId);
  });

  const itemRef = useSignal<HTMLInputElement>();

  const itemContext: ItemContext = {
    index
  };

  useContextProvider(itemContextId, itemContext);

  const itemValue = useComputed$(() => context.code.value[index.value] ?? "");

  const isHighlighted = useComputed$(() => {
    if (!context.isFocused.value) {
      return false;
    }

    const value = context.code.value;

    const start = context.selectionStart.value;
    const end = context.selectionEnd.value;
    const idx = index.value;
    if (start !== null && end !== null && start !== end) {
      return idx >= start && idx < end;
    }

    return idx === context.currentIndex.value && !value[idx];
  });

  return (
    <div
      {...props}
      ref={itemRef}
      // The identifier for individual OTP input items with their index
      data-qds-otp-item={index.value}
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
