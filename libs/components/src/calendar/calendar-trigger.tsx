import { Slot, component$ } from "@builder.io/qwik";
import { PopoverTriggerBase } from "../popover/popover-trigger";

export const CalendarTrigger = component$(() => {
  return (
    <PopoverTriggerBase>
      <Slot />
    </PopoverTriggerBase>
  );
});
