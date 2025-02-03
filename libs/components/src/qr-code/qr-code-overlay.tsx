import { type PropsOf, Slot, component$ } from "@builder.io/qwik";

export const QRCodeOverlay = component$((props: PropsOf<"div">) => {
  return (
    <div {...props} data-qds-qr-overlay>
      <Slot />
    </div>
  );
});
