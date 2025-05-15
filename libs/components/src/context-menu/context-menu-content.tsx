import { Slot, component$, useContext, useTask$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { DropdownContentBase, DropdownContentProps } from "../dropdown/dropdown-content";
import { contextMenuExtensionId } from "./context-menu-context";
import { dropdownContextId } from "../dropdown/dropdown-context";

/** A component that renders the context menu content */
export const ContextMenuContentBase = component$<DropdownContentProps>((props) => {
  const dropdownContext = useContext(dropdownContextId);
  const contextExtension = useContext(contextMenuExtensionId);

  // Position the context menu at the mouse coordinates
  useTask$(({ track }) => {
    track(() => dropdownContext.isOpenSig.value);
    track(() => contextExtension.triggerX.value);
    track(() => contextExtension.triggerY.value);
    track(() => dropdownContext.rootRef.value);

    // Close menu if it was opened without valid coordinates
    const x = contextExtension.triggerX.value;
    const y = contextExtension.triggerY.value;

    if (dropdownContext.isOpenSig.value && (x <= 0 || y <= 0)) {
      // If opened without valid coordinates (e.g., left click), close it immediately
      dropdownContext.isOpenSig.value = false;
      return;
    }

    // Position menu at mouse coordinates (right-click)
    if (
      dropdownContext.isOpenSig.value &&
      dropdownContext.rootRef.value &&
      x > 0 &&
      y > 0
    ) {
      const contentEl = document.querySelector("[data-qds-context-menu-content]");
      if (!contentEl) return;

      const { innerWidth, innerHeight } = window;
      const contentRect = contentEl.getBoundingClientRect();

      // Calculate position ensuring menu is within viewport
      let posX = x;
      let posY = y;

      // Adjust horizontally if needed
      if (posX + contentRect.width > innerWidth) {
        posX = Math.max(0, innerWidth - contentRect.width);
      }

      // Adjust vertically if needed
      if (posY + contentRect.height > innerHeight) {
        posY = Math.max(0, innerHeight - contentRect.height);
      }

      contentEl.setAttribute(
        "style",
        `position: absolute; left: ${posX}px; top: ${posY}px;`
      );
    }
  });

  return (
    <DropdownContentBase
      data-qds-context-menu-content
      {...props}
    >
      <Slot />
    </DropdownContentBase>
  );
});

export const ContextMenuContent = withAsChild(ContextMenuContentBase);
