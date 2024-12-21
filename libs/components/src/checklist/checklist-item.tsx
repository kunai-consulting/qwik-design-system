import { component$, Slot, useContext, useSignal, useTask$, type PropsOf } from "@builder.io/qwik";
import { Checkbox } from "..";
import { checklistContextId } from "./checklist-context";

type ChecklistItemProps = PropsOf<typeof Checkbox.Root> & {
  _index?: number;
};

export const ChecklistItem = component$((props: ChecklistItemProps) => {
  console.log(props._index);
  const context = useContext(checklistContextId);

  if (props._index === undefined) {
    throw new Error('Qwik Design System: Checklist Item must have an index');
  }

  const index = props._index;
  const isCheckedSig = useSignal(false);

  useTask$(function checkAllManager({ track }) {
    track(() => context.isAllCheckedSig.value);

    if (context.isAllCheckedSig.value === true) {
      isCheckedSig.value = true;
    } else if (context.isAllCheckedSig.value === false) {
      isCheckedSig.value = false;
    }
  })

  useTask$(function checkItemsManager({ track }) {
    track(() => isCheckedSig.value)

    context.checkedStatesSig.value[index] = isCheckedSig.value;

    if (context.checkedStatesSig.value.every(state => state === true)) {
      context.isAllCheckedSig.value = true;
    } else if (context.checkedStatesSig.value.every(state => state === false)) {
      context.isAllCheckedSig.value = false;
    } else {
      context.isAllCheckedSig.value = 'mixed';
    }
  })

  return (
    <Checkbox.Root bind:checked={isCheckedSig} {...props}>
      <Slot />
    </Checkbox.Root>
  );
});
