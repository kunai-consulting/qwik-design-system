import {
  type PropsOf,
  Slot,
  component$,
  useContext,
  useStylesScoped$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverContentBase } from "../popover/popover-content";
import { popoverContextId } from "../popover/popover-root";
import { dropdownContextId } from "./dropdown-context";

export type DropdownContentProps = PropsOf<typeof PopoverContentBase>;

export const DropdownContentBase = component$<DropdownContentProps>((props) => {
  const context = useContext(dropdownContextId);
  const popoverContext = useContext(popoverContextId);
  useStylesScoped$(
    "/* Add basic content styles */ [data-qds-dropdown-content] { list-style: none; padding: 0.25rem; margin: 0; border: 1px solid gray; background: white; z-index: 10; } "
  );

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
