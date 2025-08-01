import {
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useSignal
} from "@qwik.dev/core";
import { CheckboxRoot } from "../checkbox/checkbox-root";
import { type ChecklistContext, checklistContextId } from "./checklist-context";

type PublicChecklistRootProps = Omit<PropsOf<"div">, "onChange$">;

export const ChecklistRoot = component$((props: PublicChecklistRootProps) => {
  const isAllCheckedSig = useSignal(false);
  const checkedStatesSig = useSignal<(boolean | "mixed")[]>([]);
  const currItemIndex = 0;

  const context: ChecklistContext = {
    isAllCheckedSig,
    checkedStatesSig,
    currItemIndex
  };

  useContextProvider(checklistContextId, context);

  // The checkbox root to the select all checkbox
  return (
    <CheckboxRoot
      role="group"
      bind:checked={isAllCheckedSig}
      // Identifies the root container element of the checklist component
      data-qds-checklist-root
      {...props}
    >
      <Slot />
    </CheckboxRoot>
  );
});
