import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { Checkbox } from "..";

export const ChecklistItemLabel = component$((props: PropsOf<typeof Checkbox.Label>) => {
  return (
    <Checkbox.Label {...props}>
      <Slot />
    </Checkbox.Label>
  );
});
