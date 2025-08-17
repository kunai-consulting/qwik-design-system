import { $, type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { modalContextId } from "./modal-root";

export const ModalClose = component$((props: PropsOf<"button">) => {
  const context = useContext(modalContextId);

  const handleClose$ = $(() => {
    context.isOpen.value = false;
  });

  return (
    <Render fallback="button" onClick$={[handleClose$, props.onClick$]} {...props}>
      <Slot />
    </Render>
  );
});
