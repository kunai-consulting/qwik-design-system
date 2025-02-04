import { type PropsOf, Slot, component$ } from "@builder.io/qwik";

export const QRCodeFrame = component$((props: PropsOf<"div">) => {
  return (
    <div data-qds-qr-code-frame {...props}>
      <Slot />
    </div>
  );
});
