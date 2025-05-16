import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { getNextIndex } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export type TabsTriggerProps = PropsOf<"button"> & {
  _index?: number;
};

export const TabsTriggerBase = component$((props: TabsTriggerProps) => {
  return (
    <Render data-qds-tabs-trigger role="tab" fallback="button" {...props}>
      <Slot />
    </Render>
  );
});

export const TabsTrigger = withAsChild(TabsTriggerBase, (props) => {
  const index = getNextIndex("tabs-trigger");
  props._index = index;

  return props;
});
