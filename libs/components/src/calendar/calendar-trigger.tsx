import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { PopoverTrigger } from "../popover/popover-trigger";

export const CalendarTrigger = component$((props: PropsOf<"button">) => {
  return (
    <PopoverTrigger {...props} data-qds-calendar-trigger>
      <Slot />
    </PopoverTrigger>
  );
});
