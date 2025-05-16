import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export type TabsRootProps = PropsOf<"div">;

export const TabsRootBase = component$((props: TabsRootProps) => {
  return (
    <Render fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const TabsRoot = withAsChild(TabsRootBase);
