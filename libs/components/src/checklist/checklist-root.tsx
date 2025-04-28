import {
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useSignal
} from "@builder.io/qwik";
import { resetIndexes } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { CheckboxRootBase } from "../checkbox/checkbox-root";
import { type ChecklistContext, checklistContextId } from "./checklist-context";

type PublicChecklistRootProps = Omit<PropsOf<"div">, "onChange$">;

export const ChecklistRootBase = component$((props: PublicChecklistRootProps) => {
  const isAllCheckedSig = useSignal(false);
  const checkedStatesSig = useSignal<(boolean | "mixed")[]>([]);

  const context: ChecklistContext = {
    isAllCheckedSig,
    checkedStatesSig
  };

  useContextProvider(checklistContextId, context);

  // The checkbox root to the select all checkbox
  return (
    <CheckboxRootBase
      role="group"
      bind:checked={isAllCheckedSig}
      // Identifies the root container element of the checklist component
      data-qds-checklist-root
      {...props}
    >
      <Slot />
    </CheckboxRootBase>
  );
});

export const ChecklistRoot = withAsChild(ChecklistRootBase, (props) => {
  resetIndexes("qds-checklist");

  return props;
});
