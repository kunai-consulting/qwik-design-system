import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { modalContextId } from "./modal-root";

export const ModalContent = component$((props: PropsOf<"dialog">) => {
  const context = useContext(modalContextId);

  return (
    <dialog ref={context.contentRef} {...props}>
      <Slot />
    </dialog>
  );
});
