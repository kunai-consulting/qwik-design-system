import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { getNextIndex } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export type TabsContentProps = PropsOf<"div"> & {
  _index?: number;
};

export const TabsContentBase = component$((props: TabsContentProps) => {
  return (
    <Render data-qds-tabs-content role="tabpanel" fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const TabsContent = withAsChild(TabsContentBase, (props) => {
  const index = getNextIndex("tabs-content");
  props._index = index;

  return props;
});
