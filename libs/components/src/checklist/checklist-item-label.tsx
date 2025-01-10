import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { Checkbox } from "..";

export const ChecklistItemLabel = component$((props: PropsOf<typeof Checkbox.Label>) => {
  return (
    <Checkbox.Label {...props}>
      <Slot />
    </Checkbox.Label>
  );
});
