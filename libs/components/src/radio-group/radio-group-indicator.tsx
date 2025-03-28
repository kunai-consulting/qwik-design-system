import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupItemContextId } from "./radio-group-item";

type PublicIndicatorProps = PropsOf<"span">;

export const RadioGroupIndicatorBase = component$((props: PublicIndicatorProps) => {
  const itemContext = useContext(radioGroupItemContextId);

  return (
    <Render
      {...props}
      fallback="span"
      data-qds-indicator
      data-is-selected={`${itemContext.isSelectedSig.value}`}
      data-checked={itemContext.isSelectedSig.value}
      data-hidden={!itemContext.isSelectedSig.value}
      aria-hidden="true"
    >
      <Slot />
    </Render>
  );
});

export const RadioGroupIndicator = withAsChild(RadioGroupIndicatorBase);
