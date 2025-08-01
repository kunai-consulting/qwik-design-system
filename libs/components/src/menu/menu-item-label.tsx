import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { Render } from "../render/render";
export type PublicMenuItemLabelProps = PropsOf<"span">;

/** Label component for menu items */
export const MenuItemLabel = component$<PublicMenuItemLabelProps>((props) => {
  return (
    // The identifier for the menu item label element
    <Render data-qds-menu-item-label {...props} fallback="span">
      <Slot />
    </Render>
  );
});
