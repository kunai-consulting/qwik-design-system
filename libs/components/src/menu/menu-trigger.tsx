import { $, type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { PopoverTrigger } from "../popover/popover-trigger";
import { menuContextId } from "./menu-root";

export type PublicMenuTriggerProps = Omit<
  PropsOf<typeof PopoverTrigger>,
  "popovertarget" | "id" | "aria-haspopup" | "aria-expanded" | "aria-controls"
>;

export const MenuTrigger = component$<PublicMenuTriggerProps>((props) => {
  const context = useContext(menuContextId);

  const handleKeyDown = $((event: KeyboardEvent) => {
    const { key } = event;

    if (key === "ArrowDown" || key === "Enter" || key === " " || key === "ArrowUp") {
      const rootEl = context.contentRef?.value || context.rootRef?.value;

      if (!rootEl) return;

      if (key === "ArrowDown") {
        context.openFocusDirection.value = "first";
      } else if (key === "ArrowUp") {
        context.openFocusDirection.value = "last";
      }

      context.isOpenSig.value = true;
    }
  });

  return (
    <PopoverTrigger
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
    </PopoverTrigger>
  );
});
