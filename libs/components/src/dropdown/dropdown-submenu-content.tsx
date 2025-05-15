import { Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverContentBase } from "../popover/popover-content";
import { dropdownContextId } from "./dropdown-context";
import { submenuContextId } from "./dropdown-submenu-context";
import type { PropsOf } from "@builder.io/qwik";
/** Props for the submenu content component */
export type PublicDropdownSubmenuContentProps = PropsOf<typeof PopoverContentBase>;

/** A component that renders the submenu content */
export const DropdownSubmenuContentBase = component$<PublicDropdownSubmenuContentProps>(
  () => {
    const context = useContext(dropdownContextId);
    const ids = useContext(submenuContextId);

    // Find the submenu state for this content
    const submenu = context.submenus.value.find(
      (submenu) => submenu.contentId === ids.contentId
    );

    if (!submenu) {
      console.warn("Submenu content not found in context");
      return null;
    }

    return (
      <PopoverContentBase
        role="menu"
        id={ids.contentId}
        aria-labelledby={ids.contentId}
        data-qds-dropdown-submenu-content
        data-position={submenu.position}
      >
        <Slot />
      </PopoverContentBase>
    );
  }
);

export const DropdownSubmenuContent = withAsChild(DropdownSubmenuContentBase);
