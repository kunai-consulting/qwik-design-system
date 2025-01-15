import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { Checkbox } from "..";

export const ChecklistItemIndicator = component$(
  (props: PropsOf<typeof Checkbox.Indicator>) => {
    return (
      <Checkbox.Indicator {...props}>
        <Slot />
      </Checkbox.Indicator>
    );
  }
);
