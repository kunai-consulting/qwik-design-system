import { type Signal, createContextId } from "@qwik.dev/core";

export type ChecklistContext = {
  isAllCheckedSig: Signal<boolean | "mixed">;
  checkedStatesSig: Signal<(boolean | "mixed")[]>;
};

export const checklistContextId = createContextId<ChecklistContext>("checklist");
