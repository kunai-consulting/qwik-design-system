import {
  type PropsOf,
  Slot,
  component$,
  useConstant,
  useContext,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { CheckboxRoot } from "../checkbox/checkbox-root";
import { checklistContextId } from "./checklist-context";

type PublicChecklistItemProps = {
  /** Internal prop for tracking item position in checklist */
  _index?: number;
} & Omit<PropsOf<typeof CheckboxRoot>, "_index">;

/** Internal prop for tracking item position in checklist */
export const ChecklistItem = component$((props: PublicChecklistItemProps) => {
  const context = useContext(checklistContextId);

  const index = useConstant(() => {
    const currIndex = context.currItemIndex;
    context.currItemIndex++;
    return currIndex;
  });

  const isCheckedSig = useSignal(false);
  const isSelectAllSig = useSignal(false);

  useTask$(function checkAllManager({ track }) {
    track(() => context.isAllCheckedSig.value);

    isSelectAllSig.value = true;

    if (context.isAllCheckedSig.value === true) {
      isCheckedSig.value = true;
    } else if (context.isAllCheckedSig.value === false) {
      isCheckedSig.value = false;
    }
  });

  useTask$(function checkItemsManager({ track }) {
    track(() => isCheckedSig.value);

    if (isSelectAllSig.value) return;

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
    <CheckboxRoot bind:checked={isCheckedSig} {...props}>
      <Slot />
    </CheckboxRoot>
  );
});
