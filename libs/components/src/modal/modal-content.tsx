import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { modalContextId } from "./modal-root";

export const ModalContent = component$((props: PropsOf<"dialog">) => {
  const context = useContext(modalContextId);

  return (
    <dialog ref={context.contentRef} {...props}>
      <Slot />
    </dialog>
  );
});
