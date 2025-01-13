import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { Checkbox } from "..";

export const ChecklistItemDescription = component$(
  (props: PropsOf<typeof Checkbox.Description>) => {
    return (
      <Checkbox.Description {...props}>
        <Slot />
      </Checkbox.Description>
    );
  }
);
