import { type HTMLElementAttrs, Slot, component$ } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
export type PublicMenuItemLabelProps = HTMLElementAttrs<"span">;

/** Label component for menu items */
export const MenuItemLabelBase = component$<PublicMenuItemLabelProps>((props) => {
  return (
    // The identifier for the menu item label element
    <Render data-qds-menu-item-label {...props} fallback="span">
      <Slot />
    </Render>
  );
});
export const MenuItemLabel = withAsChild(MenuItemLabelBase);
