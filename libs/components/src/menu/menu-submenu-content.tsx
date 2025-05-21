import { Slot, component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import type { PropsOf } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverContentBase } from "../popover/popover-content";
import { type SubmenuState, menuContextId } from "./menu-root";
import { submenuContextId } from "./menu-submenu";
import { getSubmenuStateByContentId } from "./utils";

/** Props for the submenu content component */
export type PublicMenuSubmenuContentProps = PropsOf<typeof PopoverContentBase>;

/** A component that renders the submenu content */
export const MenuSubmenuContentBase = component$<PublicMenuSubmenuContentProps>(
  (props) => {
    const context = useContext(menuContextId);
    const submenuContext = useContext(submenuContextId);
    const submenu = useSignal<SubmenuState | undefined>(undefined);

    if (!submenuContext) {
      console.warn("Submenu context not found in context");
      return null;
    }

    useTask$(async () => {
      submenu.value = await getSubmenuStateByContentId(context, submenuContext.contentId);
    });

    if (!submenu.value) {
      console.warn("Submenu content not found in content");
      return null;
    }

    return (
      <PopoverContentBase
        role="menu"
        id={submenuContext.contentId}
        aria-labelledby={submenuContext.triggerId}
        data-qds-menu-submenu-content
        data-position={submenu.value.position}
        {...props}
      >
        <Slot />
      </PopoverContentBase>
    );
  }
);

export const MenuSubmenuContent = withAsChild(MenuSubmenuContentBase);
