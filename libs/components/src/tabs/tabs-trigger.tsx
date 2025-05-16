import {
  type PropsOf,
  Slot,
  component$,
  useContext,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { getNextIndex } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { tabsContextId } from "./tabs-root";

export type TabsTriggerProps = PropsOf<"button"> & {
  _index?: number;
};

export const TabsTriggerBase = component$((props: TabsTriggerProps) => {
  const triggerRef = useSignal<HTMLButtonElement>();
  const context = useContext(tabsContextId);

  useTask$(function setIndexOrder() {
    const index = props._index;
    if (index === undefined) return;

    context.triggerRefs.value[index] = triggerRef;
  });

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
