import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { qrCodeContextId } from "./qr-code-context";

/** SVG container for the QR code pattern */
export const QRCodePatternSvg = component$((props: PropsOf<"svg">) => {
  const context = useContext(qrCodeContextId);
  const size = context.data.value.length;

  const viewBox = `0 0 ${size} ${size}`;

  return (
    // SVG container element for the QR code pattern
    <svg {...props} viewBox={viewBox} data-qds-qr-pattern-svg aria-hidden="true">
      <Slot />
    </svg>
  );
});
