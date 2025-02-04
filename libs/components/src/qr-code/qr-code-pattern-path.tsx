import { type PropsOf, component$, useContext } from "@builder.io/qwik";
import { qrCodeContextId } from "./qr-code-context";

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

  return (
    <path
      {...props}
      d={pathData}
      data-qds-qr-pattern-path
    />
  );
});
