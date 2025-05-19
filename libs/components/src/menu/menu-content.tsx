import { type PropsOf, Slot, component$, useContext, useTask$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverContentBase } from "../popover/popover-content";
import { menuContextId } from "./menu-context";

export type MenuContentProps = PropsOf<typeof PopoverContentBase>;

/** A component that renders the menu content */
export const MenuContentBase = component$<MenuContentProps>((props) => {
  const context = useContext(menuContextId);

  // Position the content at mouse coordinates when opened via context menu
  useTask$(({ track, cleanup }) => {
    // Track these values to reposition when any of them change
    const isOpen = track(() => context.isOpenSig.value);
    const isContextMenu = track(() => context.isContextMenu);
    const x = track(() => context.contextMenuX);
    const y = track(() => context.contextMenuY);
    const contentEl = track(() => context.contentRef.value);
    let initialMargin = 0;

    // Check if this is a context menu and should be positioned
    if (isOpen && isContextMenu && x > 0 && y > 0 && contentEl) {
      // Wait for content to be rendered before positioning
      requestAnimationFrame(() => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        const body = document.body;
        const styles = window.getComputedStyle(body);
        initialMargin = Number.parseFloat(styles.marginRight);
        body.style.overflow = "hidden";
        body.style.userSelect = "none";
        document.body.style.marginRight = `${initialMargin + scrollbarWidth}px`;

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

    cleanup(() => {
      document.body.style.overflow = "";
      document.body.style.userSelect = "";
      if (initialMargin !== 0) {
        document.body.style.marginRight = `${initialMargin}px`;
      }
    });
  });

  return (
    <PopoverContentBase
      id={context.contentId} // Use ID from main context
      ref={context.contentRef}
      role="menu"
      aria-labelledby={context.triggerId} // Labelled by the main trigger
      data-qds-menu-content
      {...props}
    >
      <Slot />
    </PopoverContentBase>
  );
});

export const MenuContent = withAsChild(MenuContentBase);
