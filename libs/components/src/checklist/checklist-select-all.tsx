import { component$, type PropsOf, Slot, useContext, useTask$ } from "@builder.io/qwik";
import { Checkbox } from "..";
import { checklistContextId } from "./checklist-context";

export const ChecklistSelectAll = component$(
  (props: PropsOf<typeof Checkbox.Trigger>) => {
    return (
      <Checkbox.Trigger data-qds-checklist-select-all-trigger {...props}>
        <Slot />
      </Checkbox.Trigger>
    );
  }
);
