import { $, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import {
  DropdownTriggerBase,
  type PublicDropdownTriggerProps
} from "../dropdown/dropdown-trigger";
import { contextMenuExtensionId } from "./context-menu-context";
import { dropdownContextId } from "../dropdown/dropdown-context";

/** Area that activates the context menu */
export const ContextMenuTriggerBase = component$<PublicDropdownTriggerProps>((props) => {
  const contextExtension = useContext(contextMenuExtensionId);
  const dropdownContext = useContext(dropdownContextId);

  const handleContextMenu = $(async (event: MouseEvent) => {
    // Always stop propagation to prevent any other handlers
    event.preventDefault();
    // event.stopPropagation();

    // Store the mouse position
    contextExtension.triggerX.value = event.clientX;
    contextExtension.triggerY.value = event.clientY;

    // Open the context menu
    dropdownContext.isOpenSig.value = true;
  });

  const handleKeyDown = $(async (event: KeyboardEvent) => {
    const { key } = event;
    // Context menu is usually associated with pressing the "ContextMenu" key on the keyboard
    if (key === "ContextMenu") {
      // Clear coordinates since this isn't a mouse event
      contextExtension.triggerX.value = 0;
      contextExtension.triggerY.value = 0;
      dropdownContext.isOpenSig.value = true;
    }
  });

  // Completely prevent the dropdown from opening on click
  // const handleClick = $((event: MouseEvent) => {
  //
  //   // Close any already open context menu
  //   if (dropdownContext.isOpenSig.value) {
  //     dropdownContext.isOpenSig.value = false;
  //   }
  //
  //   // Reset coordinates
  //   contextExtension.triggerX.value = 0;
  //   contextExtension.triggerY.value = 0;
  //
  //   return false;
  // });

  return (
    <DropdownTriggerBase
      onContextMenu$={handleContextMenu}
      onKeyDown$={handleKeyDown}
      // onClick$={handleClick}
      // Important: Disable the normal trigger behavior
      data-qds-context-menu-trigger
      // Prevent dropdown from using this as a clickable trigger
      disabled={true}
      // Override any button behavior from PopoverTrigger
      role="presentation"
      {...props}
    >
      <Slot />
    </DropdownTriggerBase>
  );
});

export const ContextMenuTrigger = withAsChild(ContextMenuTriggerBase);
