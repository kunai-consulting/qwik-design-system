import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { Checkbox } from "..";

export const ChecklistSelectAllIndicator = component$(
  (props: PropsOf<typeof Checkbox.Indicator>) => {
    return (
      <Checkbox.Indicator data-qds-checklist-select-all-indicator {...props}>
        <Slot />
      </Checkbox.Indicator>
    );
  }
);
