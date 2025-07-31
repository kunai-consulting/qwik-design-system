import {
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { encode } from "uqr";
import { qrCodeContextId } from "./qr-code-context";
import "./qr-code.css";
type PublicRootProps = PropsOf<"div"> & {
  /** The text value to encode in the QR code */
  value?: string;
  /** The error correction level of the QR code. L = Low, M = Medium, Q = Quartile, H = High */
  level?: "L" | "M" | "Q" | "H";
};
/** Root component for the QR code that manages state and context */
export const QRCodeRoot = component$<PublicRootProps>((props) => {
  const value = useSignal(props.value || "");
  const level = useSignal(props.level || "L");
  const data = useSignal<boolean[][]>([]);
  useTask$(({ track }) => {
    track(() => value.value);
    track(() => level.value);
    const qrResult = encode(value.value, {
      ecc: level.value,
      border: 0
    });
    data.value = qrResult.data;
  });
  const context = {
    value,
    level,
    data
  };
  useContextProvider(qrCodeContextId, context);
  return (
    <div
      {...props}
      // Root container element for the entire QR code component
      data-qds-qr-code-root
      role="img"
      aria-label={props["aria-label"] || `QR code for ${value.value}`}
    >
      <Slot />
    </div>
  );
});
