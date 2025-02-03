import { component$, useContext } from "@builder.io/qwik";
import { encode } from "uqr";
import { qrCodeContextId } from "./qr-code-context";

export const QRCodePattern = component$(() => {
  const context = useContext(qrCodeContextId);

  const qrResult = encode(context.value.value, {
    ecc: context.level.value,
    border: context.margin.value
  });

  const moduleSize = Math.floor(
    (context.size.value - 2 * context.margin.value) / qrResult.size
  );
  const offset = Math.floor((context.size.value - moduleSize * qrResult.size) / 2);

  return (
    <svg
      width={context.size.value}
      height={context.size.value}
      viewBox={`0 0 ${context.size.value} ${context.size.value}`}
      data-qds-qr-pattern
      aria-hidden="true"
    >
      <rect
        width={context.size.value}
        height={context.size.value}
        fill={context.background.value || "white"}
      />

      <g>
        {qrResult.data.map((row, y) =>
          row.map((isBlack, x) =>
            isBlack ? (
              <rect
                // biome-ignore lint/suspicious/noArrayIndexKey: x and y unique
                key={`${x}-${y}`}
                x={offset + x * moduleSize}
                y={offset + y * moduleSize}
                width={moduleSize}
                height={moduleSize}
                fill={context.foreground.value || "black"}
              />
            ) : null
          )
        )}
      </g>
    </svg>
  );
});
