import { $ } from "@builder.io/qwik";
import type { DropdownContext, ItemRef, SubmenuState } from "./dropdown-context";

/**
 * Returns all enabled (not disabled) item elements from an array of refs.
 */
export function getEnabledItemsUtil(itemRefs: ItemRef[]): HTMLElement[] {
  return itemRefs
    .map((itemRefObj) => itemRefObj.ref.value)
    .filter((el): el is HTMLElement => {
      if (!el) return false;
      if (el.hasAttribute("data-disabled") || el.hasAttribute("disabled")) return false;
      return true;
    });
}

/**
 * Finds a submenu state by its contentId from the dropdown context.
 */
export const getSubmenuStateByContentId = $(
  (context: DropdownContext, contentId: string) => {
    return context.submenus.value.find((submenu) => submenu.contentId === contentId);
  }
);

/**
 * Given a parentId, returns the parent submenu or root context.
 */
export const getParent = $((context: DropdownContext, parentId: string | undefined) => {
  let parent: SubmenuState | DropdownContext;
  if (parentId === context.contentId || !parentId) {
    parent = context;
  } else {
    parent = context.submenus.value.find(
      (submenu) => submenu.contentId === parentId
    ) as SubmenuState;
  }
  return parent;
});

/**
 * Focuses the first enabled item in a list, with a timeout.
 */
export const focusFirstItem = $((enabledItems: HTMLElement[]) => {
  setTimeout(async () => {
    if (enabledItems.length > 0) {
      enabledItems[0].focus();
    }
  }, 50);
});
