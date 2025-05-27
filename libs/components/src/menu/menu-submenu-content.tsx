import { Slot, component$, useContext } from "@builder.io/qwik";
import type { PropsOf } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverContentBase } from "../popover/popover-content";
import { menuContextId } from "./menu-root";

/** Props for the submenu content component */
export type PublicMenuSubmenuContentProps = PropsOf<typeof PopoverContentBase>;

/** A component that renders the submenu content */
export const MenuSubmenuContentBase = component$<PublicMenuSubmenuContentProps>(
  (props) => {
    const submenuContext = useContext(menuContextId);

    if (!submenuContext) {
      console.warn("Submenu context not found in context");
      return null;
    }

    if (!submenuContext) {
      console.warn("Submenu content not found in content");
      return null;
    }

    return (
      <PopoverContentBase
        role="menu"
        id={submenuContext.contentId}
        aria-labelledby={submenuContext.triggerId}
        data-qds-menu-submenu-content
        data-position={submenuContext.position}
        ref={submenuContext.contentRef}
        {...props}
      >
        <Slot />
      </PopoverContentBase>
    );
  }
);

export const MenuSubmenuContent = withAsChild(MenuSubmenuContentBase);
