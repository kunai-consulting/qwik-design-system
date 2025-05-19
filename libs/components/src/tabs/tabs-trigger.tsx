import {
  $,
  type PropsOf,
  Slot,
  component$,
  sync$,
  useComputed$,
  useContext,
  useOnWindow,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { getNextIndex } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { tabsContextId } from "./tabs-root";

export type TabsTriggerProps = PropsOf<"button"> & {
  _index?: number;
  value?: string;
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

  const isActiveSig = useComputed$(() => {
    const isIndexBased = Number.parseInt(context.selectedValueSig.value) === props._index;

    const isValueBased = props.value === context.selectedValueSig.value;

    return isIndexBased || isValueBased;
  });

  useOnWindow(
    "keydown",
    sync$((e: KeyboardEvent) => {
      if (!document.activeElement?.hasAttribute("data-qds-tabs-trigger")) return;

      const keys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Home", "End"];

      if (!keys.includes(e.key)) return;

      e.preventDefault();
    })
  );

  const handleNavigation$ = $((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowRight":
        break;
      case "ArrowLeft":
        break;
    }
  });

  return (
    <Render
      data-qds-tabs-trigger
      role="tab"
      fallback="button"
      onClick$={[handleSelect$, props.onClick$]}
      onKeyDown$={[handleNavigation$, props.onKeyDown$]}
      tabIndex={isActiveSig.value ? 0 : -1}
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
