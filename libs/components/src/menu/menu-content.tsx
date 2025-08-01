import {
  type PropsOf,
  Slot,
  component$,
  useContext,
  useTask$,
  useVisibleTask$
} from "@qwik.dev/core";
import { PopoverContent } from "../popover/popover-content";
import { menuContextId } from "./menu-root";
import { getFirstMenuItem, getLastMenuItem } from "./utils";

export type MenuContentProps = PropsOf<typeof PopoverContent>;

/** A component that renders the menu content */
export const MenuContent = component$<MenuContentProps>((props) => {
  const context = useContext(menuContextId);

  // Position the content at mouse coordinates when opened via context menu
  useTask$(({ track }) => {
    // Track these values to reposition when any of them change
    const isOpen = track(() => context.isOpenSig.value);
    const isContextMenu = track(() => context.isContextMenu?.value ?? false);
    const x = track(() => context.contextMenuX?.value ?? 0);
    const y = track(() => context.contextMenuY?.value ?? 0);
    const contentEl = track(() => context.contentRef.value);

    // Check if this is a context menu and should be positioned
    if (isOpen && isContextMenu && x > 0 && y > 0 && contentEl) {
      const { innerWidth, innerHeight } = window;
      const contentRect = contentEl.getBoundingClientRect();

      // Apply standard context menu positioning
      let posX = x;
      let posY = y;

      // Adjust if the menu would overflow the viewport
      if (x + contentRect.width > innerWidth) {
        posX = Math.max(0, x - contentRect.width);
      }

      if (posY + contentRect.height > innerHeight) {
        posY = Math.max(0, y - contentRect.height);
      }

      // Apply fixed positioning to handle scrolling properly
      contentEl.style.position = "fixed";
      contentEl.style.left = `${posX}px`;
      contentEl.style.top = `${posY}px`;
    }
  });

  // WARNING: Only use this if you know what you are doing
  // Focus the first or last item when the menu opens
  useVisibleTask$(({ track }) => {
    const isOpen = track(() => context.isOpenSig.value);
    const direction = track(() => context.openFocusDirection.value);
    if (isOpen && context.openFocusDirection.value) {
      const rootEl = context.contentRef.value || context.rootRef.value;
      if (!rootEl) return;
      if (direction === "first") {
        getFirstMenuItem(rootEl)?.focus();
      } else if (direction === "last") {
        getLastMenuItem(rootEl)?.focus();
      }
    }
  });

  return (
    <PopoverContent
      id={context.contentId} // Use ID from main context
      ref={context.contentRef}
      role="menu"
      aria-labelledby={context.triggerId} // Labelled by the main trigger
      data-qds-menu-content
      {...props}
    >
      <Slot />
    </PopoverContent>
  );
});
