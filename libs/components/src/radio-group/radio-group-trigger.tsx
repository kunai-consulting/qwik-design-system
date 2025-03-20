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
import { getNextIndex } from "../../utils/indexer";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";

type PublicTriggerProps = PropsOf<"button"> & {
  _index?: number;
};

export const RadioGroupTriggerBase = component$((props: PublicTriggerProps) => {
  const context = useContext(radioGroupContextId);
  const triggerRef = useSignal<HTMLElement>();
  const { _index, ...restProps } = props;
  const value = context.itemValue;

  useTask$(function getIndexOrder() {
    if (_index === undefined) {
      throw new Error("RadioGroupTrigger cannot find its proper index.");
    }

    context.triggerRefsArray.value[_index] = {
      ref: triggerRef,
      value
    };
  });

  const isSelectedSig = useComputed$(() => context.selectedValueSig.value === value);
  const isDisabledSig = useComputed$(() => context.isDisabledSig.value || props.disabled);

  const tabIndexSig = useComputed$(() => {
    const isSelected = isSelectedSig.value;
    const isFirstItem = _index === 0;
    const noSelection = !context.selectedValueSig.value;

    return isSelected || (noSelection && isFirstItem) ? 0 : -1;
  });

  const handleClick$ = $(() => {
    if (isDisabledSig.value) return;
    context.selectedValueSig.value = value;
  });

  const handleKeyDown$ = $((event: KeyboardEvent) => {
    if (isDisabledSig.value) return;

    if (event.key === " " || event.key === "Enter") {
      handleClick$();
    }
  });

  return (
    <Render
      fallback="button"
      {...restProps}
      ref={triggerRef}
      type="button"
      role="radio"
      aria-checked={isSelectedSig.value}
      data-checked={isSelectedSig.value}
      data-qds-radio-group-trigger
      data-disabled={isDisabledSig.value || undefined}
      value={value}
      onClick$={[handleClick$, props.onClick$]}
      onKeyDown$={[handleKeyDown$, props.onKeyDown$]}
      disabled={isDisabledSig.value}
      tabIndex={tabIndexSig.value}
    >
      <Slot />
    </Render>
  );
});

export const RadioGroupTrigger = withAsChild(RadioGroupTriggerBase, (props) => {
  const nextIndex = getNextIndex("radioGroup");
  props._index = nextIndex;
  return props;
});
