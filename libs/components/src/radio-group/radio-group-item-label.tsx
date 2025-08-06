import { $, type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";
import { radioGroupItemContextId } from "./radio-group-item";

type PublicLabelProps = PropsOf<"span">;

export const RadioGroupItemLabel = component$((props: PublicLabelProps) => {
  const context = useContext(radioGroupContextId);
  const itemContext = useContext(radioGroupItemContextId);
  const itemLabelId = `${itemContext.itemId}-label`;

  const handlePointerDown$ = $((e: PointerEvent) => {
    const currItem = context.triggerRefsArray.value[itemContext.itemIndex].ref.value;

    if (currItem.disabled) return;

    context.selectedValueSig.value = itemContext.itemValue;

    currItem.focus();
  });

  return (
    <Render
      {...props}
      id={itemLabelId}
      data-qds-radio-group-label
      fallback="span"
      onPointerDown$={[handlePointerDown$, props.onPointerDown$]}
    >
      <Slot />
    </Render>
  );
});
