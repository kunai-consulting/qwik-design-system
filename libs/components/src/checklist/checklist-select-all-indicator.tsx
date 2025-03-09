import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { Checkbox } from "..";

export const ChecklistSelectAllIndicator = component$(
  (props: PropsOf<typeof Checkbox.Indicator>) => {
    return (
      // Identifies the indicator element for the select all checkbox
      <Checkbox.Indicator data-qds-checklist-select-all-indicator {...props}>
        <Slot />
      </Checkbox.Indicator>
    );
  }
);
