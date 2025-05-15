import { Slot, component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverContentBase } from "../popover/popover-content";
import { dropdownContextId, type SubmenuState } from "./dropdown-context";
import { submenuContextId } from "./dropdown-submenu-context";
import type { PropsOf } from "@builder.io/qwik";
import { getSubmenuStateByContentId } from "./utils";
import { useDropdownWalker } from "./use-dropdown-walker";
/** Props for the submenu content component */
export type PublicDropdownSubmenuContentProps = PropsOf<typeof PopoverContentBase>;

/** A component that renders the submenu content */
export const DropdownSubmenuContentBase = component$<PublicDropdownSubmenuContentProps>(
  (props) => {
    const context = useContext(dropdownContextId);
    const submenuContext = useContext(submenuContextId);
    const submenu = useSignal<SubmenuState | undefined>(undefined);
    const isInitialRenderSig = useSignal(true);

    useTask$(async () => {
      submenu.value = await getSubmenuStateByContentId(context, submenuContext.contentId);
    });

    if (!submenu.value) {
      console.warn("Submenu content not found in context");
      return null;
    }

    useTask$(async ({ track }) => {
      const isOpen = track(() => submenu.value?.isOpenSig.value);
      if (isInitialRenderSig.value) {
        isInitialRenderSig.value = false;
        return;
      }

      if (!isOpen) {
        const { getDropdownMenuItems } = useDropdownWalker();
        const items = getDropdownMenuItems(
          submenuContext.parentRef.value,
          submenuContext.parentId
        );
        if (items.length > 0) {
          items[0].focus();
        }
      } else {
        if (!submenu.value?.rootRef.value) return;
        const { getDropdownMenuItems } = useDropdownWalker();

        const items = getDropdownMenuItems(
          submenu.value.rootRef.value,
          submenuContext.contentId
        );
        if (items.length > 0) {
          items[0].focus();
        }
      }
    });

    return (
      <PopoverContentBase
        tabIndex={-1}
        role="menu"
        ref={submenu.value?.rootRef}
        id={submenuContext.contentId}
        aria-labelledby={submenuContext.triggerId}
        data-qds-dropdown-submenu-content
        data-position={submenu.value.position}
        {...props}
      >
        <Slot />
      </PopoverContentBase>
    );
  }
);

export const DropdownSubmenuContent = withAsChild(DropdownSubmenuContentBase);
