import { type PropsOf, Slot, component$, useContext, useTask$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverContentBase } from "../popover/popover-content";
import { dropdownContextId } from "./dropdown-context";

export type DropdownContentProps = PropsOf<typeof PopoverContentBase>;

/** A component that renders the dropdown menu content */
export const DropdownContentBase = component$<DropdownContentProps>((props) => {
  const context = useContext(dropdownContextId);

  // Position the content at mouse coordinates when opened via context menu
  useTask$(({ track }) => {
    // Track these values to reposition when any of them change
    const isOpen = track(() => context.isOpenSig.value);
    const isContextMenu = track(() => context.isContextMenu);
    const x = track(() => context.contextMenuX);
    const y = track(() => context.contextMenuY);
    const contentEl = track(() => context.contentRef.value);

    // Check if this is a context menu and should be positioned
    if (isOpen && isContextMenu && x > 0 && y > 0 && contentEl) {
      // Wait for content to be rendered before positioning
      requestAnimationFrame(() => {
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
      });
    }
  });

  return (
    <PopoverContentBase
      id={context.contentId} // Use ID from main context
      ref={context.contentRef}
      role="menu"
      aria-labelledby={context.triggerId} // Labelled by the main trigger
      data-qds-dropdown-content
      {...props}
    >
      <Slot />
    </PopoverContentBase>
  );
});

export const DropdownContent = withAsChild(DropdownContentBase);
