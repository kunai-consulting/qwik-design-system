import { Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import {
  DropdownItemLabelBase,
  type PublicDropdownItemLabelProps
} from "../dropdown/dropdown-item-label";

/** Label component for context menu items */
export const ContextMenuItemLabelBase = component$<PublicDropdownItemLabelProps>(
  (props) => {
    return (
      <DropdownItemLabelBase data-qds-context-menu-item-label {...props}>
        <Slot />
      </DropdownItemLabelBase>
    );
  }
);

export const ContextMenuItemLabel = withAsChild(ContextMenuItemLabelBase);
