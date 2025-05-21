import { $, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { menuContextId } from "./menu-root";
import { MenuItem, type PublicMenuItemProps } from "./menu-item";

/** Props for the submenu trigger component */
export type PublicMenuSubmenuTriggerProps = Omit<
  PublicMenuItemProps,
  "_index" | "closeOnSelect" | "value" | "_submenuContentId"
>;

/** A component that renders the submenu trigger */
export const MenuSubmenuTriggerBase = component$<PublicMenuSubmenuTriggerProps>(
  ({ onClick$, disabled, ...props }) => {
    const submenuContext = useContext(menuContextId);

    if (!submenuContext) {
      console.warn("Submenu content not found in trigger");
      return null;
    }

    const handleClick$ = $(() => {
      if (submenuContext) {
        submenuContext.isOpenSig.value = !submenuContext.isOpenSig.value;
      }
    });

    return (
      <MenuItem
        closeOnSelect={false}
        data-qds-menu-submenu-trigger
        data-qds-menu-parent={submenuContext.parentContext?.contentId}
        aria-haspopup="menu"
        aria-controls={submenuContext.contentId}
        aria-expanded={submenuContext.isOpenSig.value}
        onClick$={[handleClick$, onClick$]}
        disabled={disabled}
        {...props}
      >
        <Slot />
      </MenuItem>
    );
  }
);

export const MenuSubmenuTrigger = withAsChild(MenuSubmenuTriggerBase);
