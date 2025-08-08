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
import { Render } from "../render/render";
import { OTPContextId } from "./otp-context";
type PublicOTPProps = PropsOf<"div">;

type ItemContext = {
  index: number;
};

export const itemContextId = createContextId<ItemContext>("qd-otp-item");

/** Individual item component for displaying a single OTP digit */
export const OtpItem = component$((props: PublicOTPProps) => {
  const context = useContext(OTPContextId);

  const index = useConstant(() => {
    const idx = context.numItems;
    context.numItems++;
    return idx;
  });

  const itemRef = useSignal<HTMLInputElement>();

  const itemContext: ItemContext = {
    index
  };

  useContextProvider(itemContextId, itemContext);

  const itemValue = useComputed$(() => context.code.value[index] ?? "");

  const isHighlighted = useComputed$(() => {
    if (!context.isFocused.value) {
      return false;
    }

    const value = context.code.value;

    const start = context.selectionStart.value;
    const end = context.selectionEnd.value;
    const idx = index;
    if (start !== null && end !== null && start !== end) {
      return idx >= start && idx < end;
    }

    return idx === context.currentIndex.value && !value[idx];
  });

  return (
    <Render
      fallback="div"
      {...props}
      internalRef={itemRef}
      // The identifier for individual OTP input items with their index
      data-qds-otp-item={index}
      // Indicates if the OTP item is currently highlighted
      data-highlighted={isHighlighted.value ? "" : undefined}
      // Indicates if the OTP item is disabled
      data-disabled={context.isDisabled.value ? "" : undefined}
    >
      {itemValue.value}
      <Slot />
    </Render>
  );
});
