import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { Checkbox } from "..";

export const ChecklistSelectAll = component$(
  (props: PropsOf<typeof Checkbox.Trigger>) => {
    return (
      // Identifies the trigger element for the select all checkbox
      <Checkbox.Trigger data-qds-checklist-select-all-trigger {...props}>
        <Slot />
      </Checkbox.Trigger>
    );
  }
);
