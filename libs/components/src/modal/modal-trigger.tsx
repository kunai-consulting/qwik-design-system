import { $, type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { modalContextId } from "./modal-root";

export const ModalTrigger = component$((props: PropsOf<"button">) => {
  const context = useContext(modalContextId);

  const handleToggle$ = $(() => {
    context.isOpen.value = !context.isOpen.value;
  });

  return (
    <Render fallback="button" onClick$={[handleToggle$, props.onClick$]} {...props}>
      <Slot />
    </Render>
  );
});
