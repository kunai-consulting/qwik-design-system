import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverTriggerBase } from "../popover/popover-trigger";
import { menuContextId } from "./menu-root";

export type PublicMenuTriggerProps = Omit<
  PropsOf<typeof PopoverTriggerBase>,
  "popovertarget" | "id" | "aria-haspopup" | "aria-expanded" | "aria-controls"
>;
/** Button that triggers the menu to open/close */
export const MenuTriggerBase = component$<PublicMenuTriggerProps>((props) => {
  const context = useContext(menuContextId);

  const handleKeyDown = $(async (event: KeyboardEvent) => {
    const { key } = event;
    if (key === "ArrowDown" || key === "Enter" || key === " ") {
      const enabledItems = await context.getEnabledItems();
      if (enabledItems && enabledItems.length > 0) {
        enabledItems[0].focus();
      }
      context.isOpenSig.value = true;
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
      // The identifier for the menu trigger button
      data-qds-menu-trigger
      type="button"
      {...props}
    >
      <Slot />
    </PopoverTriggerBase>
  );
});

export const MenuTrigger = withAsChild(MenuTriggerBase);
