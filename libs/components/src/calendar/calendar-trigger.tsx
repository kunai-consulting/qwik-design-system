import { type HTMLElementAttrs, Slot, component$ } from "@qwik.dev/core";
import { PopoverTriggerBase } from "../popover/popover-trigger";

export const CalendarTrigger = component$((props: HTMLElementAttrs<"button">) => {
  return (
    <PopoverTriggerBase {...props} data-qds-calendar-trigger>
      <Slot />
    </PopoverTriggerBase>
  );
});
