import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const ModalDescriptionBase = component$((props: PropsOf<"div">) => {
  return (
    <Render fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const ModalDescription = withAsChild(ModalDescriptionBase);
