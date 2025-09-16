import { type PropsOf, Slot, component$, useConstant, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { modalContextId } from "./modal-root";

export const ModalDescription = component$((props: PropsOf<"div">) => {
  const context = useContext(modalContextId);
  const descriptionId = `${context.localId}-description`;

  useConstant(() => {
    context.isDescription.value = true;
  });

  return (
    <Render fallback="div" {...props} id={descriptionId}>
      <Slot />
    </Render>
  );
});
