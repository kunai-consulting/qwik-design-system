import { type PropsOf, Slot, component$ } from "@builder.io/qwik";

export const DatePickerHeader = component$((props: PropsOf<"header">) => {
  return (
    <header data-qds-datepicker-header {...props}>
      <Slot />
    </header>
  );
});
