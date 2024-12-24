import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { Checkbox } from "..";

export const ChecklistItemLabel = component$((props: PropsOf<typeof Checkbox.Label>) => {
  return (
    <Checkbox.Label {...props}>
      <Slot />
    </Checkbox.Label>
  );
});
