import { Slot, component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverContentBase } from "../popover/popover-content";
import { dropdownContextId } from "./dropdown-context";
import { submenuContextId } from "./dropdown-submenu-context";
import type { PropsOf } from "@builder.io/qwik";
import { getParent } from "./utils";
/** Props for the submenu content component */
export type PublicDropdownSubmenuContentProps = PropsOf<typeof PopoverContentBase>;

/** A component that renders the submenu content */
export const DropdownSubmenuContentBase = component$<PublicDropdownSubmenuContentProps>(
  () => {
    const context = useContext(dropdownContextId);
    const submenuContext = useContext(submenuContextId);
    const isInitialRenderSig = useSignal(true);

    // Find the submenu state for this content
    const submenu = context.submenus.value.find(
      (submenu) => submenu.contentId === submenuContext.contentId
    );

    if (!submenu) {
      console.warn("Submenu content not found in context");
      return null;
    }

    // Focus the first enabled item of the parent when the submenu closes
    useTask$(async ({ track, cleanup }) => {
      track(() => submenu.isOpenSig.value);
      if (!(submenu.isOpenSig.value || isInitialRenderSig.value)) {
        const parent = await getParent(context, submenu.parentId);

        const enabledItems = await parent.getEnabledItems();

        if (enabledItems.length > 0) {
          enabledItems[0].focus();
        }
      }

      cleanup(() => {
        isInitialRenderSig.value = false;
      });
    });

    return (
      <PopoverContentBase
        role="menu"
        id={submenuContext.contentId}
        aria-labelledby={submenuContext.contentId}
        data-qds-dropdown-submenu-content
        data-position={submenu.position}
      >
        <Slot />
      </PopoverContentBase>
    );
  }
);

export const DropdownSubmenuContent = withAsChild(DropdownSubmenuContentBase);
