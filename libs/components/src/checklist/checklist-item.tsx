import {
  type PropsOf,
  Slot,
  component$,
  useContext,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { checklistContextId } from "./checklist-context";
import { CheckboxRoot } from "../checkbox/checkbox-root";
import * as Checkbox from "../checkbox";
import { withAsChild } from "../as-child/as-child";

type PublicChecklistItemProps = {
  /** Internal prop for tracking item position in checklist */
  _index?: number;
} & Omit<PropsOf<typeof CheckboxRoot>, "_index">;

/** Internal prop for tracking item position in checklist */
export const ChecklistItemBase = component$((props: PublicChecklistItemProps) => {
  // console.log(props._index);
  const context = useContext(checklistContextId);

  if (props._index === undefined) {
    throw new Error("Qwik Design System: Checklist Item must have an index");
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
  });

  useTask$(function checkItemsManager({ track }) {
    track(() => isCheckedSig.value);

    context.checkedStatesSig.value[index] = isCheckedSig.value;

    if (context.checkedStatesSig.value.every((state) => state === true)) {
      context.isAllCheckedSig.value = true;
    } else if (context.checkedStatesSig.value.every((state) => state === false)) {
      context.isAllCheckedSig.value = false;
    } else {
      context.isAllCheckedSig.value = "mixed";
    }
  });

  return (
    <Checkbox.Root bind:checked={isCheckedSig} {...props}>
      <Slot />
    </Checkbox.Root>
  );
});

export const ChecklistItem = withAsChild(ChecklistItemBase);
