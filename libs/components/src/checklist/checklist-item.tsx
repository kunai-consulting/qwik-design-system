import { component$, Slot, type PropsOf } from "@builder.io/qwik";
import { Checkbox } from "..";

type ChecklistItemProps = PropsOf<typeof Checkbox.Root> & {
  _index: number;
};

export const ChecklistItem = component$((props: ChecklistItemProps) => {
  console.log(props._index);

  return (
    <Checkbox.Root {...props}>
      <Slot />
    </Checkbox.Root>
  );
});
