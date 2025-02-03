import { component$, useContext, useTask$ } from "@builder.io/qwik";
import { qrCodeContextId } from "./qr-code-context";

export interface OverlayProps {
  image: string;
  size?: number;
}

export const QRCodeOverlay = component$<OverlayProps>((props) => {
  const context = useContext(qrCodeContextId);

  useTask$(({ track }) => {
    track(() => props.image);
    track(() => props.size);

    context.overlay.value = {
      image: props.image,
      size: props.size
    };
  });

  return null;
});
