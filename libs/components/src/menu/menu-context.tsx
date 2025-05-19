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

export type MenuContext = {
  /** Whether the menu is open */
  isOpenSig: Signal<boolean>;
  /** The submenus in the menu */
  submenus: Signal<SubmenuState[]>;
  /** ID of the menu content element */
  contentId: string;
  /** ID of the menu trigger element */
  triggerId: string;
  /** The item refs of the menu */
  itemRefs: Signal<ItemRef[]>;
  /** The currently focused element within the menu */
  currentFocusEl: Signal<HTMLElement | undefined>;
  /** Get the enabled items of the menu */
  getEnabledItems: QRL<() => HTMLElement[]>;
  /** Root reference to the menu container */
  rootRef: Signal<HTMLElement | undefined>;
  /** X coordinate for context menu positioning */
  contextMenuX: number;
  /** Y coordinate for context menu positioning */
  contextMenuY: number;
  /** Whether the menu was opened via context menu */
  isContextMenu: boolean;
  /** Reference to the content element */
  contentRef: Signal<HTMLElement | undefined>;
};

export const menuContextId = createContextId<MenuContext>("menu-context");
