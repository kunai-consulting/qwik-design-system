import {
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useSignal
} from "@builder.io/qwik";
import { Checkbox } from "..";
import { findComponent, processChildren } from "../../utils/inline-component";
import { type ChecklistContext, checklistContextId } from "./checklist-context";
import { ChecklistItem } from "./checklist-item";
type PublicChecklistRootProps = Omit<PropsOf<"div">, "onChange$"> & {
  /** Internal prop for tracking number of checklist items */
  _numItems?: number;
};
export const ChecklistRoot = ({ children, ...props }: PublicChecklistRootProps) => {
  let currItemIndex = 0;
  let numItems = 0;

  findComponent(ChecklistItem, (itemProps) => {
    itemProps._index = currItemIndex;
    currItemIndex++;
    numItems = currItemIndex;
  });

  processChildren(children);

  return (
    <ChecklistBase _numItems={numItems} {...props}>
      {children}
    </ChecklistBase>
  );
};
export const ChecklistBase = component$((props: PublicChecklistRootProps) => {
  const isAllCheckedSig = useSignal(false);
  const checkedStatesSig = useSignal<(boolean | "mixed")[]>([]);

  const context: ChecklistContext = {
    isAllCheckedSig,
    checkedStatesSig
  };

  useContextProvider(checklistContextId, context);

  // The checkbox root to the select all checkbox
  return (
    <Checkbox.Root
      role="group"
      bind:checked={isAllCheckedSig}
      // Identifies the root container element of the checklist component
      data-qds-checklist-root
      {...props}
    >
      <Slot />
    </Checkbox.Root>
  );
});
