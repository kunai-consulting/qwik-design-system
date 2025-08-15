import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { CheckboxTriggerBase } from "../checkbox/checkbox-trigger";

/** Select all trigger component for the checklist */
export const ChecklistSelectAll = component$(
  (props: PropsOf<typeof CheckboxTriggerBase>) => {
    return (
      // Identifies the trigger element for the select all checkbox
      <CheckboxTriggerBase
        data-qds-checklist-select-all-trigger
        {...props}
        data-qds-checkbox-trigger={undefined}
      >
        <Slot />
      </CheckboxTriggerBase>
    );
  }
);
