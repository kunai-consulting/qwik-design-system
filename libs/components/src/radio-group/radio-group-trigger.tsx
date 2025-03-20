import {
  $,
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useContext,
  useSignal,
  useVisibleTask$
} from "@builder.io/qwik";
import { getNextIndex } from "../../utils/indexer";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";

type PublicTriggerProps = PropsOf<"button"> & {
  value: string;
  _index?: number;
};

export const RadioGroupTriggerBase = component$((props: PublicTriggerProps) => {
  const context = useContext(radioGroupContextId);
  const radioGroupRef = useSignal<HTMLElement>();
  const { value, _index, ...restProps } = props;

  useVisibleTask$(({ track, cleanup }) => {
    const element = track(() => radioGroupRef.value);
    if (!element) return;

    context.registerTrigger$(element, _index);
    cleanup(() => context.unregisterTrigger$(element));
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
      ref={radioGroupRef}
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
