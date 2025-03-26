import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { CheckboxLabelBase } from "../checkbox/checkbox-label";

// no-as-child TODO: remove this comment

export const ChecklistLabel = component$((props: PropsOf<typeof CheckboxLabelBase>) => {
  return (
    // Identifies the label element for the select all checkbox in the checklist
    <CheckboxLabelBase data-qds-checklist-select-all-label {...props}>
      <Slot />
    </CheckboxLabelBase>
  );
});
