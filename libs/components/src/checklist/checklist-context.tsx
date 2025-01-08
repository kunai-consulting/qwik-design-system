import { createContextId, Signal } from "@builder.io/qwik";

export type ChecklistContext = {
  isAllCheckedSig: Signal<boolean | "mixed">;
  checkedStatesSig: Signal<(boolean | "mixed")[]>;
};

export const checklistContextId = createContextId<ChecklistContext>("checklist");
