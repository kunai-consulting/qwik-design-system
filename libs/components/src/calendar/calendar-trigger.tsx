import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { PopoverTriggerBase } from "../popover/popover-trigger";

export const CalendarTrigger = component$((props: PropsOf<"button">) => {
  return (
    <PopoverTriggerBase {...props}>
      <Slot />
    </PopoverTriggerBase>
  );
});
