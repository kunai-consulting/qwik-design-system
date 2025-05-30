import { type PropsOf, Slot, component$ } from "@builder.io/qwik";

export const ModalContent = component$((props: PropsOf<"dialog">) => {
  return (
    <dialog {...props}>
      <Slot />
    </dialog>
  );
});
