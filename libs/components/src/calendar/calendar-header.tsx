import { Slot, component$, type HTMLElementAttrs } from "@qwik.dev/core";

/** A component that renders the calendar header section */
export const CalendarHeader = component$((props: HTMLElementAttrs<"header">) => {
  return (
    // The header component of the calendar
    <header data-qds-calendar-header {...props}>
      <Slot />
    </header>
  );
});
