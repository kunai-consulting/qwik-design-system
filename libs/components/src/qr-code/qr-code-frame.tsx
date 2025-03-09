import { type PropsOf, Slot, component$ } from "@qwik.dev/core";

/** A container component for QR code frame styling */
export const QRCodeFrame = component$((props: PropsOf<"div">) => {
  return (
    // Container element for framing the QR code content
    <div data-qds-qr-code-frame {...props}>
      <Slot />
    </div>
  );
});
