import { type QRL, type Signal, createContextId } from "@builder.io/qwik";

type ItemRef = {
  ref: Signal;
};

export type SubmenuState = {
  /** ID of the submenu trigger element */
  triggerId: string;
  /** ID of the submenu content element */
  contentId: string;
  /** The position of the submenu relative to its trigger */
  position: "right" | "left" | "bottom" | "top";
  /** Whether the submenu is open */
  isOpenSig: Signal<boolean>;
  /** Whether the submenu is disabled */
  disabled: boolean;
  /** The items in the submenu */
  itemRefs: Signal<ItemRef[]>;
  /** Get the enabled items in the submenu */
  getEnabledItems: QRL<() => HTMLElement[]>;
  /** The parent submenu */
  parentId: string;
};

export type DropdownContext = {
  /** Whether the dropdown is open */
  isOpenSig: Signal<boolean>;
  /** The submenus in the dropdown */
  submenus: Signal<SubmenuState[]>;
  contentId: string;
  triggerId: string;
  itemRefs: Signal<ItemRef[]>;
  getEnabledItems: QRL<() => HTMLElement[]>;
  closeAllSubmenus: QRL<() => void>;
};

export const dropdownContextId = createContextId<DropdownContext>("dropdown-context");
