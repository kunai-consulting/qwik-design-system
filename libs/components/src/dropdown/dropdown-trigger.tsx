import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverTriggerBase } from "../popover/popover-trigger";
import { dropdownContextId } from "./dropdown-context";

export type PublicDropdownTriggerProps = Omit<
  PropsOf<typeof PopoverTriggerBase>,
  "popovertarget"
>;
/** Button that triggers the dropdown menu to open/close */
export const DropdownTriggerBase = component$<PublicDropdownTriggerProps>((props) => {
  const context = useContext(dropdownContextId);

  const focusFirstItem = $(() => {
    setTimeout(async () => {
      const enabledItems = await context.getEnabledItems();
      if (enabledItems.length > 0) {
        enabledItems[0].focus();
      }
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
