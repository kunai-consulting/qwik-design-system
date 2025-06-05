import {
  $,
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useContext,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { getNextIndex } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";
import { radioGroupItemContextId } from "./radio-group-item";

type PublicTriggerProps = PropsOf<"button"> & {
  _index?: number;
};

const TriggerBase = component$((props: PublicTriggerProps) => {
  const context = useContext(radioGroupContextId);
  const itemContext = useContext(radioGroupItemContextId);
  const triggerRef = useSignal<HTMLElement>();
  const { _index, ...restProps } = props;
  const value = itemContext.itemValue;
  const itemLabelId = `${itemContext.itemId}-label`;

  useTask$(function getIndexOrder() {
    if (_index === undefined) {
      throw new Error("RadioGroupTrigger cannot find its proper index.");
    }

    context.triggerRefsArray.value[_index] = {
      ref: triggerRef,
      value
    };
  });

  const isDisabledSig = useComputed$(() => context.isDisabledSig.value || props.disabled);

  const tabIndexSig = useComputed$(() => {
    const isSelected = itemContext.isSelectedSig.value;
    const isFirstItem = _index === 0;
    const noSelection = !context.selectedValueSig.value;

    return isSelected || (noSelection && isFirstItem) ? 0 : -1;
  });

  const handleSelection$ = $(() => {
    if (isDisabledSig.value) return;
    context.selectedValueSig.value = value;
  });

  const handleKeyDown$ = $(async (event: KeyboardEvent) => {
    if (isDisabledSig.value) return;

    if (event.key === " " || event.key === "Enter") {
      await handleSelection$();
    }
  });

  return (
    <Render
      fallback="button"
      {...restProps}
      internalRef={triggerRef}
      type="button"
      role="radio"
      aria-checked={itemContext.isSelectedSig.value}
      data-checked={itemContext.isSelectedSig.value}
      data-qds-radio-group-trigger
      data-disabled={isDisabledSig.value || undefined}
      value={value}
      onClick$={[handleSelection$, props.onClick$]}
      onKeyDown$={[handleKeyDown$, props.onKeyDown$]}
      disabled={isDisabledSig.value}
      tabIndex={tabIndexSig.value}
      aria-labelledby={itemLabelId}
    >
      <Slot />
    </Render>
  );
});

export const RadioGroupItemTrigger = withAsChild(TriggerBase, (props) => {
  const nextIndex = getNextIndex("radioGroup");
  props._index = nextIndex;
  return props;
});
