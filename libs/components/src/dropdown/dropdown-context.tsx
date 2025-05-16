import { type QRL, type Signal, createContextId } from "@builder.io/qwik";

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
  /** The item refs of the submenu */
  itemRefs: Signal<ItemRef[]>;
  /** Get the enabled items of the submenu */
  getEnabledItems: QRL<() => HTMLElement[]>;
};

export type DropdownContext = {
  /** Whether the dropdown is open */
  isOpenSig: Signal<boolean>;
  /** The submenus in the dropdown */
  submenus: Signal<SubmenuState[]>;
  /** ID of the dropdown content element */
  contentId: string;
  /** ID of the dropdown trigger element */
  triggerId: string;
  /** The item refs of the dropdown */
  itemRefs: Signal<ItemRef[]>;
  /** The currently focused element within the dropdown */
  currentFocusEl: Signal<HTMLElement | undefined>;
  /** Get the enabled items of the dropdown */
  getEnabledItems: QRL<() => HTMLElement[]>;
  /** Root reference to the dropdown container */
  rootRef: Signal<HTMLElement | undefined>;
  /** X coordinate for context menu positioning */
  contextMenuX: number;
  /** Y coordinate for context menu positioning */
  contextMenuY: number;
  /** Whether the dropdown was opened via context menu */
  isContextMenu: boolean;
};

export const dropdownContextId = createContextId<DropdownContext>("dropdown-context");
