import {
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useSignal
} from "@builder.io/qwik";
import { qrCodeContextId } from "./qr-code-context";

type RootProps = PropsOf<"div"> & {
  value?: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  margin?: number;
  "aria-label"?: string;
};

export const QRCodeRoot = component$<RootProps>((props) => {
  const value = useSignal(props.value || "");
  const size = useSignal(props.size || 200);
  const level = useSignal(props.level || "L");
  const margin = useSignal(props.margin || 4);
  const overlay = useSignal<{ image: string; size?: number } | undefined>(undefined);

  const context = {
    value,
    size,
    level,
    margin,
    overlay
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
