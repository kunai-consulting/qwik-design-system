import { $, Slot, component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { type SubmenuState, menuContextId } from "./menu-context";
import { MenuItem, type PublicMenuItemProps } from "./menu-item";
import { submenuContextId } from "./menu-submenu-context";
import { getSubmenuStateByContentId } from "./utils";

/** Props for the submenu trigger component */
export type PublicMenuSubmenuTriggerProps = Omit<
  PublicMenuItemProps,
  "_index" | "closeOnSelect" | "value" | "_submenuContentId"
>;

/** A component that renders the submenu trigger */
export const MenuSubmenuTriggerBase = component$<PublicMenuSubmenuTriggerProps>(
  ({ onClick$, disabled, ...props }) => {
    const context = useContext(menuContextId);
    const submenuContext = useContext(submenuContextId);
    const submenu = useSignal<SubmenuState | undefined>(undefined);

    useTask$(async () => {
      submenu.value = await getSubmenuStateByContentId(context, submenuContext.contentId);
    });

    if (!submenu.value) {
      console.warn("Submenu content not found in trigger");
      return null;
    }

    const handleClick$ = $(async () => {
      if (submenu.value) {
        submenu.value.isOpenSig.value = !submenu.value.isOpenSig.value;
      }
    });

    return (
      <MenuItem
        closeOnSelect={false}
        data-qds-menu-submenu-trigger
        data-qds-menu-parent={submenu.value.parentId}
        qds-submenu-level={submenuContext.level}
        aria-haspopup="menu"
        aria-controls={submenu.value.contentId}
        aria-expanded={submenu.value.isOpenSig.value}
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
