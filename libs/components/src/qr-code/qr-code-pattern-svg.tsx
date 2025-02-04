import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { qrCodeContextId } from "./qr-code-context";

export const QRCodePatternSvg = component$((props: PropsOf<"svg">) => {
  const context = useContext(qrCodeContextId);
  const size = context.data.value.length;

  const viewBox = `0 0 ${size} ${size}`;

  return (
    <svg
      {...props}
      viewBox={viewBox}
      data-qds-qr-pattern-svg
      aria-hidden="true"
    >
      <Slot />
    </svg>
  );
});
