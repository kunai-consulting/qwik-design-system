import { type Signal, createContextId } from "@builder.io/qwik";

export interface QRCodeContext {
  value: Signal<string>;
  level: Signal<"L" | "M" | "Q" | "H">;
  data: Signal<boolean[][]>;
}

export const qrCodeContextId = createContextId<QRCodeContext>("qr-code-context");
