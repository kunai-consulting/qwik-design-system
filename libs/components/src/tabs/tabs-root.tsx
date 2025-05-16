import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { resetIndexes } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export type TabsRootProps = PropsOf<"div">;

export const TabsRootBase = component$((props: TabsRootProps) => {
  return (
    <Render data-qds-tabs-root fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const TabsRoot = withAsChild(TabsRootBase, (props) => {
  resetIndexes("tabs-trigger");
  resetIndexes("tabs-content");

  return props;
});
