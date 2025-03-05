import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const ResizablePanelBase = component$<PropsOf<"div">>((props) => {
  return (
    <Render fallback="div" {...props} data-qds-resizable-panel>
      <Slot />
    </Render>
  );
});

export const ResizablePanel = withAsChild(ResizablePanelBase);
