import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export type TabsContentProps = PropsOf<"div">;

export const TabsContentBase = component$((props: TabsContentProps) => {
  return (
    <Render role="tabpanel" fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const TabsContent = withAsChild(TabsContentBase);
