import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { CheckboxLabel } from "../checkbox/checkbox-label";

// no-as-child TODO: remove this comment

export const ChecklistLabel = component$((props: PropsOf<typeof CheckboxLabel>) => {
  return (
    // Identifies the label element for the select all checkbox in the checklist
    <CheckboxLabel data-qds-checklist-select-all-label {...props}>
      <Slot />
    </CheckboxLabel>
  );
});
