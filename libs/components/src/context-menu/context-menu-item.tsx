import { Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import {
  DropdownItemBase,
  type PublicDropdownItemProps
} from "../dropdown/dropdown-item";

/** Interactive item within a context menu */
export const ContextMenuItemBase = component$<PublicDropdownItemProps>((props) => {
  return (
    <DropdownItemBase data-qds-context-menu-item {...props}>
      <Slot />
    </DropdownItemBase>
  );
});

export const ContextMenuItem = withAsChild(ContextMenuItemBase);
