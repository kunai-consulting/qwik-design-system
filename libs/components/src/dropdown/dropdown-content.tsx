import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverContentBase } from "../popover/popover-content";
import { popoverContextId } from "../popover/popover-root";
import { dropdownContextId } from "./dropdown-context";

export type DropdownContentProps = PropsOf<typeof PopoverContentBase>;

export const DropdownContentBase = component$<DropdownContentProps>((props) => {
  const context = useContext(dropdownContextId);
  const popoverContext = useContext(popoverContextId);

  return (
    <PopoverContentBase
      id={context.contentId}
      role="menu"
      aria-labelledby={context.triggerId}
      ref={popoverContext.contentRef}
      data-qds-dropdown-content
      {...props}
    >
      <Slot />
    </PopoverContentBase>
  );
});

export const DropdownContent = withAsChild(DropdownContentBase);
