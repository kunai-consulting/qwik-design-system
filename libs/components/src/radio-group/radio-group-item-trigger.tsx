import {
  $,
  type PropsOf,
  Slot,
  component$,
  sync$,
  useComputed$,
  useContext,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";
import { radioGroupItemContextId } from "./radio-group-item";

type PublicTriggerProps = PropsOf<"button">;

export const RadioGroupItemTrigger = component$((props: PublicTriggerProps) => {
  const context = useContext(radioGroupContextId);
  const itemContext = useContext(radioGroupItemContextId);
  const triggerRef = useSignal<HTMLElement>();
  const { ...restProps } = props;
  const value = itemContext.itemValue;
  const itemLabelId = `${itemContext.itemId}-label`;
  
  const menuContext = useContext(menuContextId, null);

  const role = useComputed$(() => {
    return menuContext ? "menuitemradio" : "radio";
  });
    
  const itemIndex = itemContext.itemIndex;

  useTask$(function getIndexOrder() {
    if (itemIndex === undefined) {
      throw new Error("RadioGroupTrigger cannot find its proper index.");
    }

    context.triggerRefsArray.value[itemIndex] = {
      ref: triggerRef,
      value
    };
  });

  const isDisabledSig = useComputed$(() => context.isDisabledSig.value || props.disabled);

  const tabIndexSig = useComputed$(() => {
    const isSelected = itemContext.isSelectedSig.value;
    const isFirstItem = itemIndex === 0;
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

  const handleKeyDownSync$ = sync$((event: KeyboardEvent) => {
    const preventKeys = [
      "ArrowRight",
      "ArrowLeft",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End"
    ];
    if (preventKeys.includes(event.key)) {
      event.preventDefault();
    }
  });

  return (
    <Render
      fallback="button"
      role={role.value}
      type="button"
      {...restProps}
      internalRef={triggerRef}
      aria-checked={itemContext.isSelectedSig.value}
      data-checked={itemContext.isSelectedSig.value}
      data-qds-radio-group-trigger
      data-disabled={isDisabledSig.value || undefined}
      value={value}
      onClick$={[handleSelection$, props.onClick$]}
      onKeyDown$={[handleKeyDownSync$, handleKeyDown$, props.onKeyDown$]}
      disabled={isDisabledSig.value}
      tabIndex={tabIndexSig.value}
      aria-labelledby={itemLabelId}
    >
      <Slot />
    </Render>
  );
});
