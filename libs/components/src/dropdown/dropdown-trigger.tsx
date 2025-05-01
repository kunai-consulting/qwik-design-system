import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverAnchorBase } from "../popover/popover-anchor";
import { popoverContextId } from "../popover/popover-root";
import { dropdownContextId } from "./dropdown-context";

export type PublicDropdownTriggerProps = Omit<
  PropsOf<typeof PopoverAnchorBase>,
  "popovertarget"
>;
/** Button that triggers the dropdown menu to open/close */
export const DropdownTriggerBase = component$<PublicDropdownTriggerProps>((props) => {
  const context = useContext(dropdownContextId);
  const popoverContext = useContext(popoverContextId);

  return (
    <PopoverAnchorBase
      popovertarget={context.contentId}
      id={context.triggerId}
      aria-haspopup="menu"
      aria-expanded={context.isOpenSig.value}
      aria-controls={context.isOpenSig.value ? context.contentId : undefined}
      ref={popoverContext.anchorRef}
      // The identifier for the dropdown trigger button
      data-qds-dropdown-trigger
      type="button"
      {...props}
    >
      <Slot />
    </PopoverAnchorBase>
  );
});

export const DropdownTrigger = withAsChild(DropdownTriggerBase);
