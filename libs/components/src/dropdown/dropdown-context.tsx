import { type Signal, createContextId } from "@builder.io/qwik";

type ItemRef = {
  ref: Signal;
};

export type DropdownContext = {
  isOpenSig: Signal<boolean>;
  contentId: string;
  triggerId: string;
  itemRefs: Signal<ItemRef[]>;
};

export const dropdownContextId = createContextId<DropdownContext>("dropdown-context");
