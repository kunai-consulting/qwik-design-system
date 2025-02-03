import {
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useSignal,
  useStyles$
} from "@builder.io/qwik";
import { qrCodeContextId } from "./qr-code-context";
import styles from "./qr-code.css?inline";

type RootProps = PropsOf<"div"> & {
  value?: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  margin?: number;
  "aria-label"?: string;
  background?: string;
  foreground?: string;
};

export const QRCodeRoot = component$<RootProps>((props) => {
  useStyles$(styles);

  const value = useSignal(props.value || "");
  const size = useSignal(props.size || 200);
  const level = useSignal(props.level || "L");
  const margin = useSignal(props.margin || 4);
  const background = useSignal(props.background || "white");
  const foreground = useSignal(props.foreground || "black");

  const context = {
    value,
    size,
    level,
    margin,
    background,
    foreground
  };

  useContextProvider(qrCodeContextId, context);

  return (
    <div
      {...props}
      data-qds-qr-code-root
      role="img"
      aria-label={props["aria-label"] || `QR code for ${value.value}`}
    >
      <Slot />
    </div>
  );
});
