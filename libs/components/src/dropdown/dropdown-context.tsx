import { type Signal, createContextId } from "@builder.io/qwik";

export type DropdownContext = {
  isOpenSig: Signal<boolean>;
  contentId: string;
  triggerId: string;
};

export const dropdownContextId = createContextId<DropdownContext>("dropdown-context");
