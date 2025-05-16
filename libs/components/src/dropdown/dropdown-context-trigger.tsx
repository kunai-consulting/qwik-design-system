import {
  $,
  type PropsOf,
  Slot,
  component$,
  useContext,
  useSignal
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { dropdownContextId } from "./dropdown-context";

/**
 * A trigger that opens the dropdown on right-click (context menu)
 */
export const DropdownContextTriggerBase = component$<PropsOf<"div">>((props) => {
  const context = useContext(dropdownContextId);
  const triggerRef = useSignal<HTMLElement>();

  const handleContextMenu = $((event: MouseEvent) => {
    // Update context menu state
    context.isContextMenu = true;
    context.contextMenuX = event.clientX;
    context.contextMenuY = event.clientY;

    // Force open state regardless of current state
    // This ensures the menu doesn't toggle closed on second right-click
    if (!context.isOpenSig.value) {
      context.isOpenSig.value = true;
    } else {
      // If already open, we need to force a re-render at the new position
      // Use requestAnimationFrame to ensure the DOM is updated
      requestAnimationFrame(() => {
        const contentEl = context.contentRef.value;
        if (!contentEl) return;

        // Update position based on right-click coordinates
        let posX = event.clientX;
        let posY = event.clientY;

        const { innerWidth, innerHeight } = window;
        const contentRect = contentEl.getBoundingClientRect();

        // Adjust if the menu would overflow the viewport
        if (posX + contentRect.width > innerWidth) {
          posX = Math.max(0, posX - contentRect.width);
        }

        if (posY + contentRect.height > innerHeight) {
          posY = Math.max(0, posY - contentRect.height);
        }

        // Apply fixed positioning
        contentEl.style.position = "fixed";
        contentEl.style.left = `${posX}px`;
        contentEl.style.top = `${posY}px`;
      });
    }
  });

  return (
    <Render
      fallback="div"
      ref={triggerRef}
      preventdefault:contextmenu
      onContextMenu$={[handleContextMenu, props.onContextMenu$]}
      data-qds-dropdown-context-trigger
      role="presentation"
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const DropdownContextTrigger = withAsChild(DropdownContextTriggerBase);
