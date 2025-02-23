import { component$, PropsOf, Slot } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";

export const ResizablePanelBase = component$<PropsOf<"div">>((props) => {
  return (
    <Render fallback="div" {...props} data-qds-panel>
      <Slot />
    </Render>
  );
});

export const ResizablePanel = withAsChild(ResizablePanelBase);
