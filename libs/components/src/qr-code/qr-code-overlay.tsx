import { type PropsOf, Slot, component$ } from "@builder.io/qwik";

/** A component for overlaying content on top of the QR code */
export const QRCodeOverlay = component$((props: PropsOf<"div">) => {
  return (
    // Container element for overlaying content on top of the QR code
    <div {...props} data-qds-qr-overlay>
      <Slot />
    </div>
  );
});
