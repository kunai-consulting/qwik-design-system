import { component$, Slot, type PropsOf } from "@builder.io/qwik";
import { Checkbox } from "..";

export const ChecklistItem = component$((props: PropsOf<typeof Checkbox.Root>) => {
  console.log(props._index);

  return (
    <Checkbox.Root {...props}>
      <Slot />
    </Checkbox.Root>
  );
});
