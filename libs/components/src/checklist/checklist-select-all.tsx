import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { Checkbox } from "..";

export const ChecklistSelectAll = component$(
  (props: PropsOf<typeof Checkbox.Trigger>) => {
    return (
      <Checkbox.Trigger data-qds-checklist-select-all-trigger {...props}>
        <Slot />
      </Checkbox.Trigger>
    );
  }
);
