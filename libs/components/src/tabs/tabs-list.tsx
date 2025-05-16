import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export type TabsListProps = PropsOf<"div">;

export const TabsListBase = component$((props: TabsListProps) => {
  return (
    <Render role="tablist" fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const TabsList = withAsChild(TabsListBase);
