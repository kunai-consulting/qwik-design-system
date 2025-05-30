import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { modalContextId } from "./modal-root";

export const ModalTriggerBase = component$((props: PropsOf<"button">) => {
  const context = useContext(modalContextId);

  const handleToggle$ = $(() => {
    context.isOpenSig.value = !context.isOpenSig.value;
  });

  return (
    <Render fallback="button" onClick$={[handleToggle$, props.onClick$]} {...props}>
      <Slot />
    </Render>
  );
});

export const ModalTrigger = withAsChild(ModalTriggerBase);
