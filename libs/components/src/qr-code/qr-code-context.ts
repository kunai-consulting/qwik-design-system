import { type Signal, createContextId } from "@builder.io/qwik";

export interface QRCodeOverlay {
  image: string;
  size?: number;
}

export interface QRCodeContext {
  value: Signal<string>;
  size: Signal<number>;
  level: Signal<"L" | "M" | "Q" | "H">;
  margin: Signal<number>;
  overlay: Signal<QRCodeOverlay | undefined>;
}

export const qrCodeContextId = createContextId<QRCodeContext>("qr-code-context");
