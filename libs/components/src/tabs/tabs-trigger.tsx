import {
  $,
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
  value: string;
};

export const TabsTriggerBase = component$((props: TabsTriggerProps) => {
  const triggerRef = useSignal<HTMLButtonElement>();
  const context = useContext(tabsContextId);

  useTask$(function setIndexOrder() {
    const index = props._index;
    if (index === undefined) return;

    context.triggerRefs.value[index] = triggerRef;
  });

  const handleSelect$ = $(() => {
    if (props.value) {
      context.selectedValueSig.value = props.value;
    } else {
      context.selectedValueSig.value = props._index?.toString() ?? "No index";
    }
  });

  return (
    <Render
      data-qds-tabs-trigger
      role="tab"
      fallback="button"
      onClick$={[handleSelect$, props.onClick$]}
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const TabsTrigger = withAsChild(TabsTriggerBase, (props) => {
  const index = getNextIndex("tabs-trigger");
  props._index = index;

  return props;
});
