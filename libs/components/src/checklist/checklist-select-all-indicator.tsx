import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { CheckboxIndicator } from "../checkbox/checkbox-indicator";

export const ChecklistSelectAllIndicator = component$(
  (props: PropsOf<typeof CheckboxIndicator>) => {
    return (
      // Identifies the indicator element for the select all checkbox
      <CheckboxIndicator
        data-qds-checklist-select-all-indicator
        {...props}
        data-qds-checkbox-indicator={undefined}
      >
        <Slot />
      </CheckboxIndicator>
    );
  }
);
