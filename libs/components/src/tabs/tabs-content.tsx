import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export type TabsContentProps = PropsOf<"div">;

export const TabsContentBase = component$((props: TabsContentProps) => {
  return (
    <Render data-qds-tabs-content role="tabpanel" fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const TabsContent = withAsChild(TabsContentBase);
