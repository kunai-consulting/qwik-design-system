import { type QRL, type Signal, createContextId } from "@builder.io/qwik";

type ItemRef = {
  ref: Signal;
};

export type DropdownContext = {
  isOpenSig: Signal<boolean>;
  contentId: string;
  triggerId: string;
  itemRefs: Signal<ItemRef[]>;
  getEnabledItems: QRL<() => HTMLElement[]>;
};

export const dropdownContextId = createContextId<DropdownContext>("dropdown-context");
