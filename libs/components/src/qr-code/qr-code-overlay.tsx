import { type HTMLElementAttrs, Slot, component$ } from "@qwik.dev/core";

/** A component for overlaying content on top of the QR code */
export const QRCodeOverlay = component$((props: HTMLElementAttrs<"div">) => {
  return (
    // Container element for overlaying content on top of the QR code
    <div {...props} data-qds-qr-overlay>
      <Slot />
    </div>
  );
});
