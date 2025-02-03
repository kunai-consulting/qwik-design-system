import { Slot, component$ } from "@builder.io/qwik";

export const QRCodeOverlay = component$(() => {

  return (
    <div
      data-qds-qr-overlay
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Slot />
    </div>
  );
});
