import { Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const ToasterItemDescriptionBase = component$(() => {
  return (
    <Render data-qds-toaster-item-description fallback="div">
      <Slot />
    </Render>
  );
});

export const ToasterItemDescription = withAsChild(ToasterItemDescriptionBase);
