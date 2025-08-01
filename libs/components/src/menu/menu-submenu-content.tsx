import { Slot, component$, useContext, useVisibleTask$ } from "@qwik.dev/core";
import type { PropsOf } from "@qwik.dev/core";
import { PopoverContent } from "../popover/popover-content";
import { menuContextId } from "./menu-root";
import { getFirstMenuItem } from "./utils";

/** Props for the submenu content component */
export type PublicMenuSubmenuContentProps = PropsOf<typeof PopoverContent>;

/** A component that renders the submenu content */
export const MenuSubmenuContent = component$<PublicMenuSubmenuContentProps>((props) => {
  const submenuContext = useContext(menuContextId);

  if (!submenuContext) {
    console.warn("Submenu context not found in context");
    return null;
  }

  // WARNING: Only use this if you know what you are doing
  // Focus the first or last item when the menu opens
  useVisibleTask$(({ track }) => {
    const isOpen = track(() => submenuContext.isOpenSig.value);
    if (isOpen && submenuContext.openFocusDirection.value) {
      const rootEl = submenuContext.contentRef.value || submenuContext.rootRef.value;
      if (!rootEl) return;
      getFirstMenuItem(rootEl)?.focus();
    }
  });

  return (
    <PopoverContent
      role="menu"
      id={submenuContext.contentId}
      aria-labelledby={submenuContext.triggerId}
      data-qds-menu-submenu-content
      ref={submenuContext.contentRef}
      {...props}
    >
      <Slot />
    </PopoverContent>
  );
});
