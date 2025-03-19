import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { Checkbox } from "..";

// no-as-child TODO: remove this comment

export const ChecklistLabel = component$((props: PropsOf<typeof Checkbox.Label>) => {
  return (
    // Identifies the label element for the select all checkbox in the checklist
    <Checkbox.Label data-qds-checklist-select-all-label {...props}>
      <Slot />
    </Checkbox.Label>
  );
});
