import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverContentBase } from "../popover/popover-content";
import { dropdownContextId } from "./dropdown-context";

export type DropdownContentProps = PropsOf<typeof PopoverContentBase>;

/** A component that renders the dropdown menu content */
export const DropdownContentBase = component$<DropdownContentProps>((props) => {
  const context = useContext(dropdownContextId);

  return (
    <PopoverContentBase
      id={context.contentId} // Use ID from main context
      ref={context.rootRef}
      tabIndex={-1}
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
