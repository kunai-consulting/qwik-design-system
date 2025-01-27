import { component$, type PropsOf, useContext } from "@builder.io/qwik";
import { encode } from "uqr";
import { qrCodeContextId } from "./qr-code-context";

type CanvasProps = PropsOf<"svg">;

export const QRCodeCanvas = component$<CanvasProps>((props) => {
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
      {...props}
      width={context.size.value}
      height={context.size.value}
      viewBox={`0 0 ${context.size.value} ${context.size.value}`}
      data-qds-qr-container
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

      {context.overlay.value && (
        <image
          x={(context.size.value - (context.overlay.value.size || context.size.value * 0.3)) / 2}
          y={(context.size.value - (context.overlay.value.size || context.size.value * 0.3)) / 2}
          width={context.overlay.value.size || context.size.value * 0.3}
          height={context.overlay.value.size || context.size.value * 0.3}
          href={context.overlay.value.image}
        />
      )}
    </svg>
  );
});
