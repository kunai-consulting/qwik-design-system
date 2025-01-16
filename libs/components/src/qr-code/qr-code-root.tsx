import { component$, type PropsOf, Slot, useContextProvider, useSignal } from "@builder.io/qwik";
import { qrCodeContextId } from "./qr-code-context";

type RootProps = PropsOf<"div"> & {
  value?: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
};

export const QRCodeRoot = component$<RootProps>((props) => {
  const value = useSignal(props.value || '');
  const size = useSignal(props.size || 200);
  const level = useSignal(props.level || 'L');
  const margin = useSignal(props.margin || 4);
  const overlay = useSignal<{ image: string; size?: number; } | undefined>(undefined);

  const context = {
    value,
    size,
    level,
    margin,
    overlay
  };

  useContextProvider(qrCodeContextId, context);

  return (
    <div {...props} data-qr-code-root>
      <Slot />
    </div>
  );
});
