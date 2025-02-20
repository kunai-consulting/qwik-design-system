import { type PropsOf, component$, useContext } from "@qwik.dev/core";
import { qrCodeContextId } from "./qr-code-context";

/** Renders the QR code pattern as an SVG path */
export const QRCodePatternPath = component$((props: PropsOf<"path">) => {
  const context = useContext(qrCodeContextId);

  const pathData = context.data.value.reduce((acc, row, y) => {
    row.forEach((isBlack, x) => {
      if (isBlack) {
        acc += `M ${x} ${y} h 1 v 1 h -1 z `;
      }
    });
    return acc;
  }, "");

  // SVG path element that renders the QR code pattern
  return <path {...props} d={pathData} data-qds-qr-pattern-path />;
});
