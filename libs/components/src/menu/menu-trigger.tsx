import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverTriggerBase } from "../popover/popover-trigger";
import { menuContextId } from "./menu-root";
import { getFirstMenuItem, getLastMenuItem } from "./utils";

export type PublicMenuTriggerProps = Omit<
  PropsOf<typeof PopoverTriggerBase>,
  "popovertarget" | "id" | "aria-haspopup" | "aria-expanded" | "aria-controls"
>;

export const MenuTriggerBase = component$<PublicMenuTriggerProps>((props) => {
  const context = useContext(menuContextId);

  const handleKeyDown = $((event: KeyboardEvent) => {
    const { key } = event;

    if (key === "ArrowDown" || key === "Enter" || key === " " || key === "ArrowUp") {
      context.isOpenSig.value = true;

      const rootEl = context.contentRef?.value || context.rootRef?.value;

      if (!rootEl) return;

      if (key === "ArrowDown") {
        const first = getFirstMenuItem(rootEl);
        first?.focus();
      } else if (key === "ArrowUp") {
        const last = getLastMenuItem(rootEl);
        last?.focus();
      }
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
      ref={context.triggerRef}
      data-qds-menu-trigger
      type="button"
      {...props}
    >
      <Slot />
    </PopoverTriggerBase>
  );
});

export const MenuTrigger = withAsChild(MenuTriggerBase);
