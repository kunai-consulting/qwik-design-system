import { Slot, component$ } from "@builder.io/qwik";

export const QRCodeFrame = component$(() => {
  return (
    <div data-qds-qr-code-frame
         style={{
           position: "relative",
           width: "100%",
           height: "100%"
         }}>
      <Slot />
    </div>
  );
});
