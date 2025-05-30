import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { modalContextId } from "./modal-root";

export const ModalCloseBase = component$((props: PropsOf<"button">) => {
  const context = useContext(modalContextId);

  const handleClose$ = $(() => {
    context.isOpenSig.value = false;
  });

  return (
    <Render fallback="button" onClick$={[handleClose$, props.onClick$]} {...props}>
      <Slot />
    </Render>
  );
});

export const ModalClose = withAsChild(ModalCloseBase);
