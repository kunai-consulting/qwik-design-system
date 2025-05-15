import { $, Slot, component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { dropdownContextId, type SubmenuState } from "./dropdown-context";
import { submenuContextId } from "./dropdown-submenu-context";
import { DropdownItem, type PublicDropdownItemProps } from "./dropdown-item";
import { getSubmenuStateByContentId } from "./utils";

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
      <DropdownItem
        closeOnSelect={false}
        data-qds-dropdown-submenu-trigger
        data-qds-dropdown-parent={submenu.value.parentId}
        qds-submenu-level={submenuContext.level}
        aria-haspopup="menu"
        aria-controls={submenu.value.contentId}
        aria-expanded={submenu.value.isOpenSig.value}
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
