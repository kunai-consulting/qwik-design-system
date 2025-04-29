import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export type DropdownItemLabelProps = PropsOf<"span">;

export const DropdownItemLabelBase = component$<DropdownItemLabelProps>((props) => {
  return (
    <Render data-qds-dropdown-item-label {...props} fallback="span">
      <Slot />
    </Render>
  );
});

export const DropdownItemLabel = withAsChild(DropdownItemLabelBase);
