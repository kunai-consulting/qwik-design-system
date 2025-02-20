import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
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
