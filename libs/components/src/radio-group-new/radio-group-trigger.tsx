import {
  component$,
  useContext,
  $,
  type PropsOf,
  useComputed$,
  Slot, useSignal, useVisibleTask$, sync$, useTask$, useOn
} from "@builder.io/qwik";
import { radioGroupContextId } from "./radio-group-context";

type PublicTriggerProps = PropsOf<"button"> & {
  value: string;
  _index?: number;
};

export const RadioGroupTrigger = component$((props: PublicTriggerProps) => {
  const context = useContext(radioGroupContextId);
  const elementRef = useSignal<HTMLElement>();
  const { value, _index, ...restProps } = props;

  useVisibleTask$(({ track, cleanup }) => {
    const element = track(() => elementRef.value);
    if (!element) return;

    context.registerTrigger$(element, _index);
    cleanup(() => context.unregisterTrigger$(element));
  });

  const isSelectedSig = useComputed$(() => context.selectedValueSig.value === value);
  const isDisabledSig = useComputed$(() => context.isDisabledSig.value || props.disabled);

  const handleClick$ = $(() => {
    if (isDisabledSig.value) return;
    context.onChange$(value);
  });

  const handleKeyDown$ = $((event: KeyboardEvent) => {
    if (isDisabledSig.value) return;

    if (event.key === " " || event.key === "Enter") {
      sync$((e: KeyboardEvent) => e.preventDefault())(event);
      handleClick$();
    }
  });

  return (
    <button
      {...restProps}
      ref={elementRef}
      type="button"
      role="radio"
      aria-checked={isSelectedSig.value}
      data-state={isSelectedSig.value ? "checked" : undefined}
      data-qds-radio-group-trigger
      data-disabled={isDisabledSig.value || undefined}
      value={value}
      onClick$={[handleClick$, props.onClick$]}
      onKeyDown$={[handleKeyDown$, props.onKeyDown$]}
      disabled={isDisabledSig.value}
      tabIndex={isSelectedSig.value || (!context.selectedValueSig.value && _index === 0) ? 0 : -1}
    >
      <Slot />
    </button>
  );
});
