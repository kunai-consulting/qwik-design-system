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
} from "@qwik.dev/core";
import {
  getNextEnabledIndex,
  getNextIndex,
  getPrevEnabledIndex
} from "@kunai-consulting/qwik-utils";
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

  const isSelectedSig = useComputed$(() => {
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
      case "ArrowRight": {
        if (context.orientationSig.value === "vertical") {
          return;
        }

        const nextIndex = getNextEnabledIndex({
          items: context.triggerRefs.value,
          currentIndex: props._index ?? 0,
          loop: context.loopSig.value
        });

        context.triggerRefs.value[nextIndex].value?.focus();
        break;
      }

      case "ArrowDown": {
        if (context.orientationSig.value === "horizontal") {
          return;
        }

        const nextIndex = getNextEnabledIndex({
          items: context.triggerRefs.value,
          currentIndex: props._index ?? 0,
          loop: context.loopSig.value
        });

        context.triggerRefs.value[nextIndex].value?.focus();
        break;
      }

      case "ArrowLeft": {
        if (context.orientationSig.value === "vertical") {
          return;
        }

        const prevIndex = getPrevEnabledIndex({
          items: context.triggerRefs.value,
          currentIndex: props._index ?? 0,
          loop: context.loopSig.value
        });

        context.triggerRefs.value[prevIndex].value?.focus();
        break;
      }

      case "ArrowUp": {
        if (context.orientationSig.value === "horizontal") {
          return;
        }

        const prevIndex = getPrevEnabledIndex({
          items: context.triggerRefs.value,
          currentIndex: props._index ?? 0,
          loop: context.loopSig.value
        });

        context.triggerRefs.value[prevIndex].value?.focus();
        break;
      }

      case "Home": {
        const firstEnabledIndex = getNextEnabledIndex({
          items: context.triggerRefs.value,
          currentIndex: -1,
          loop: context.loopSig.value
        });

        context.triggerRefs.value[firstEnabledIndex].value?.focus();
        break;
      }

      case "End": {
        const lastEnabledIndex = getPrevEnabledIndex({
          items: context.triggerRefs.value,
          currentIndex: context.triggerRefs.value.length,
          loop: context.loopSig.value
        });

        context.triggerRefs.value[lastEnabledIndex].value?.focus();
        break;
      }
    }
  });

  return (
    <Render
      internalRef={triggerRef}
      data-qds-tabs-trigger
      role="tab"
      fallback="button"
      data-orientation={
        context.orientationSig.value === "vertical" ? "vertical" : "horizontal"
      }
      onClick$={[handleSelect$, props.onClick$]}
      onFocus$={[context.selectOnFocus ? handleSelect$ : undefined, props.onFocus$]}
      onKeyDown$={[handleNavigation$, props.onKeyDown$]}
      tabIndex={isSelectedSig.value ? 0 : -1}
      data-selected={isSelectedSig.value}
      aria-selected={isSelectedSig.value ? "true" : "false"}
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
