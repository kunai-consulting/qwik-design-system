import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export type TabsIndicatorProps = PropsOf<"div">;

export const TabsIndicatorBase = component$((props: TabsIndicatorProps) => {
  return (
    <Render fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const TabsIndicator = withAsChild(TabsIndicatorBase);
