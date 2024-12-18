import { component$, Slot, type PropsOf } from "@builder.io/qwik";
import { Checkbox } from "..";

export const ChecklistItem = component$((props: PropsOf<typeof Checkbox.Root>) => {
  return (
    <Checkbox.Root {...props}>
      <Slot />
    </Checkbox.Root>
  );
});
