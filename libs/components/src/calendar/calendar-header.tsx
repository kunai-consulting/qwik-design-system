import { type PropsOf, Slot, component$ } from "@qwik.dev/core";

/** A component that renders the calendar header section */
export const CalendarHeader = component$((props: PropsOf<"header">) => {
  return (
    // The header component of the calendar
    <header data-qds-calendar-header {...props}>
      <Slot />
    </header>
  );
});
