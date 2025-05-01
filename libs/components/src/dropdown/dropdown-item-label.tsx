import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
export type PublicDropdownItemLabelProps = PropsOf<"span">;

/** Label component for dropdown menu items */
export const DropdownItemLabelBase = component$<PublicDropdownItemLabelProps>((props) => {
  return (
    // The identifier for the dropdown item label element
    <Render data-qds-dropdown-item-label {...props} fallback="span">
      <Slot />
    </Render>
  );
});
export const DropdownItemLabel = withAsChild(DropdownItemLabelBase);
