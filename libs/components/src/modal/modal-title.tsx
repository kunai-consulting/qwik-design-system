import { type PropsOf, Slot, component$, useConstant, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { modalContextId } from "./modal-root";

export const ModalTitle = component$((props: PropsOf<"div">) => {
  const context = useContext(modalContextId);
  const titleId = `${context.localId}-title`;

  useConstant(() => {
    context.isTitle.value = true;
  });

  return (
    <Render fallback="div" {...props} id={titleId}>
      <Slot />
    </Render>
  );
});
