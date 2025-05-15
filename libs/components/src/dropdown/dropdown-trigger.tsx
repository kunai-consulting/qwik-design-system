import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverTriggerBase } from "../popover/popover-trigger";
import { dropdownContextId } from "./dropdown-context";
import { useDropdownWalker } from "./use-dropdown-walker";

export type PublicDropdownTriggerProps = Omit<
  PropsOf<typeof PopoverTriggerBase>,
  "popovertarget" | "id" | "aria-haspopup" | "aria-expanded" | "aria-controls"
>;
/** Button that triggers the dropdown menu to open/close */
export const DropdownTriggerBase = component$<PublicDropdownTriggerProps>((props) => {
  const context = useContext(dropdownContextId);

  const focusFirstItem = $(() => {
    const { getFirstDropdownItem } = useDropdownWalker();
    setTimeout(() => {
      const root = context.rootRef.value;
      if (!root) return;
      const first = getFirstDropdownItem(root);
      if (first) first.focus();
    }, 50);
  });

  const handleKeyDown = $(async (event: KeyboardEvent) => {
    const { key } = event;
    if (key === "ArrowDown" || key === "Enter" || key === " ") {
      context.isOpenSig.value = true;
      await focusFirstItem();
    }
  });

  return (
    <PopoverTriggerBase
      popovertarget={context.contentId}
      id={context.triggerId}
      aria-haspopup="menu"
      aria-expanded={context.isOpenSig.value}
      aria-controls={context.isOpenSig.value ? context.contentId : undefined}
      onKeyDown$={[handleKeyDown, props.onKeyDown$]}
      // The identifier for the dropdown trigger button
      data-qds-dropdown-trigger
      type="button"
      {...props}
    >
      <Slot />
    </PopoverTriggerBase>
  );
});

export const DropdownTrigger = withAsChild(DropdownTriggerBase);
