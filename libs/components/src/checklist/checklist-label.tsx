import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { Checkbox } from "..";

export const ChecklistLabel = component$((props: PropsOf<typeof Checkbox.Label>) => {
  return (
    <Checkbox.Label data-qds-checklist-select-all-label {...props}>
      <Slot />
    </Checkbox.Label>
  );
});
