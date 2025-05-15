import { type Signal, createContextId } from "@builder.io/qwik";

export type ItemRef = {
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
  /** The parent submenu */
  parentId: string;
  /** The root element of the submenu */
  rootRef: Signal<HTMLElement | undefined>;
};

export type DropdownContext = {
  /** Whether the dropdown is open */
  isOpenSig: Signal<boolean>;
  /** The submenus in the dropdown */
  submenus: Signal<SubmenuState[]>;
  contentId: string;
  triggerId: string;
  rootRef: Signal<HTMLElement | undefined>;
  currentFocusEl: Signal<HTMLElement | undefined>;
};

export const dropdownContextId = createContextId<DropdownContext>("dropdown-context");
