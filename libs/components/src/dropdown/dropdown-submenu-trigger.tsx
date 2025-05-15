import { $, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { dropdownContextId } from "./dropdown-context";
import { submenuContextId } from "./dropdown-submenu-context";
import { DropdownItem, type PublicDropdownItemProps } from "./dropdown-item";

/** Props for the submenu trigger component */
export type PublicDropdownSubmenuTriggerProps = Omit<
  PublicDropdownItemProps,
  "_index" | "closeOnSelect" | "value" | "_submenuContentId"
>;

/** A component that renders the submenu trigger */
export const DropdownSubmenuTriggerBase = component$<PublicDropdownSubmenuTriggerProps>(
  ({ onClick$, disabled, ...props }) => {
    const context = useContext(dropdownContextId);
    const submenuContext = useContext(submenuContextId);

    // Find the submenu state for this trigger
    const submenu = context.submenus.value.find(
      (submenu) => submenu.contentId === submenuContext.contentId
    );

    if (!submenu) {
      console.warn("Submenu trigger not found in context");
      return null;
    }

    const handleClick$ = $((e: MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      submenu.isOpenSig.value = !submenu.isOpenSig.value;
    });

    return (
      <DropdownItem
        closeOnSelect={false}
        data-qds-dropdown-submenu-trigger
        data-qds-dropdown-parent={submenu.parentId}
        qds-submenu-level={submenuContext.level}
        aria-haspopup="menu"
        aria-controls={submenu.contentId}
        aria-expanded={submenu.isOpenSig.value}
        onClick$={[handleClick$, onClick$]}
        disabled={disabled}
        {...props}
      >
        <Slot />
      </DropdownItem>
    );
  }
);

export const DropdownSubmenuTrigger = withAsChild(DropdownSubmenuTriggerBase);
