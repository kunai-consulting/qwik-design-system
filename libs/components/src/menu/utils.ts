import { $ } from "@builder.io/qwik";
import type { ItemRef, MenuContext, SubmenuState } from "./menu-context";

/**
 * Returns all enabled (not disabled) item elements from an array of refs, in DOM order.
 */
export function getEnabledItemsUtil(
  itemRefs: ItemRef[],
  container?: HTMLElement | null
): HTMLElement[] {
  // Get all enabled elements from refs
  const enabledSet = new Set(
    itemRefs
      .map((itemRefObj) => itemRefObj.ref.value)
      .filter((el): el is HTMLElement => {
        if (!el) return false;
        if (el.hasAttribute("data-disabled") || el.hasAttribute("disabled")) return false;
        return true;
      })
  );

  // If container is provided, use DOM order
  if (container) {
    const domItems = Array.from(
      container.querySelectorAll<HTMLElement>(
        "[data-qds-menu-item]:not([data-disabled]):not([disabled])"
      )
    );
    // Only include those that are in enabledSet
    return domItems.filter((el) => enabledSet.has(el));
  }

  // Fallback: return enabled items in ref order
  return Array.from(enabledSet);
}

/**
 * Finds a submenu state by its contentId from the menu context.
 */
export const getSubmenuStateByContentId = $((context: MenuContext, contentId: string) => {
  return context.submenus.value.find((submenu) => submenu.contentId === contentId);
});

/**
 * Given a parentId, returns the parent submenu or root context.
 */
export const getParent = $((context: MenuContext, parentId: string | undefined) => {
  let parent: SubmenuState | MenuContext;
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
