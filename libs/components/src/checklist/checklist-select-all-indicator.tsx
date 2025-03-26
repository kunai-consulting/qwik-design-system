import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { CheckboxIndicatorBase } from "../checkbox/checkbox-indicator";

export const ChecklistSelectAllIndicator = component$(
  (props: PropsOf<typeof CheckboxIndicatorBase>) => {
    return (
      // Identifies the indicator element for the select all checkbox
      <CheckboxIndicatorBase
        data-qds-checklist-select-all-indicator
        {...props}
        data-qds-checkbox-indicator={undefined}
      >
        <Slot />
      </CheckboxIndicatorBase>
    );
  }
);
