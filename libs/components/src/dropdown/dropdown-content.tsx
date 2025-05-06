import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverContentBase } from "../popover/popover-content";
import { popoverContextId } from "../popover/popover-root";
import { dropdownContextId } from "./dropdown-context";

export type DropdownContentProps = PropsOf<typeof PopoverContentBase>;

export const DropdownContentBase = component$<DropdownContentProps>((props) => {
  const context = useContext(dropdownContextId);
  const popoverContext = useContext(popoverContextId);

  const handleKeyDown = $((event: KeyboardEvent) => {
    const { key } = event;
    if (key !== "ArrowDown" && key !== "ArrowUp" && key !== "Home" && key !== "End")
      return;

    // Get elements from refs, filter out disabled ones
    const enabledItems = context.itemRefs.value
      .map((itemRefObj) => itemRefObj.ref.value)
      .filter(
        (el): el is HTMLElement =>
          !!el && !el.hasAttribute("data-disabled") && !el.hasAttribute("disabled")
      );

    if (enabledItems.length === 0) return;

    const activeElement = document.activeElement as HTMLElement | null;
    const currentIndex = enabledItems.findIndex((item) => item === activeElement);

    let nextIndex: number;

    if (key === "Home") {
      nextIndex = 0;
    } else if (key === "End") {
      nextIndex = enabledItems.length - 1;
    } else if (key === "ArrowDown") {
      nextIndex = currentIndex >= enabledItems.length - 1 ? 0 : currentIndex + 1;
    } else {
      nextIndex = currentIndex <= 0 ? enabledItems.length - 1 : currentIndex - 1;
    }

    enabledItems[nextIndex]?.focus();
  });

  return (
    <PopoverContentBase
      id={context.contentId} // Use ID from main context
      role="menu"
      aria-labelledby={context.triggerId} // Labelled by the main trigger
      ref={popoverContext.contentRef} // Connect ref from Popover context
      data-qds-dropdown-content
      onKeyDown$={[handleKeyDown, props.onKeyDown$]}
      {...props}
    >
      <Slot />
    </PopoverContentBase>
  );
});

export const DropdownContent = withAsChild(DropdownContentBase);
