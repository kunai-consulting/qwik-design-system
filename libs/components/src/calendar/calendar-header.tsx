import { type PropsOf, Slot, component$ } from "@builder.io/qwik";

export const CalendarHeader = component$((props: PropsOf<"header">) => {
  return (
    <header data-qds-calendar-header {...props}>
      <Slot />
    </header>
  );
});
