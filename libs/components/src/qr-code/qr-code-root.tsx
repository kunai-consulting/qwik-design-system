import {
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useSignal,
  useTask$,
  useStyles$
} from "@builder.io/qwik";
import { encode } from "uqr";
import { qrCodeContextId } from "./qr-code-context";
import styles from "./qr-code.css?inline";

type RootProps = PropsOf<"div"> & {
  value?: string;
  level?: "L" | "M" | "Q" | "H";
};

export const QRCodeRoot = component$<RootProps>((props) => {
  useStyles$(styles);

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
      data-qds-qr-code-root
      role="img"
      aria-label={props["aria-label"] || `QR code for ${value.value}`}
    >
      <Slot />
    </div>
  );
});
