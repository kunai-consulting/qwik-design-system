import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const ModalTriggerBase = component$((props: PropsOf<"button">) => {
  return (
    <Render fallback="button" {...props}>
      <Slot />
    </Render>
  );
});

export const ModalTrigger = withAsChild(ModalTriggerBase);
