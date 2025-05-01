import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const ToasterItemDescriptionBase = component$((props: PropsOf<"div">) => {
  return (
    <Render
      {...props}
      fallback="div"
      data-qds-toaster-item-description
    >
      <Slot />
    </Render>
  );
});

export const ToasterItemDescription = withAsChild(ToasterItemDescriptionBase); 