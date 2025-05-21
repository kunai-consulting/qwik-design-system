/**
 * Creates a TreeWalker for menu items, skipping disabled/hidden items and non-items.
 */
export function createMenuWalker(root: HTMLElement) {
  return document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: Element) => {
      // Only accept menu items that are enabled
      if (!node.hasAttribute("data-qds-menu-item")) {
        return NodeFilter.FILTER_SKIP;
      }
      if (node.hasAttribute("data-disabled") || node.hasAttribute("disabled")) {
        return NodeFilter.FILTER_SKIP;
      }
      if (
        node.getAttribute("aria-hidden") === "true" ||
        (node as HTMLElement).offsetParent === null
      ) {
        return NodeFilter.FILTER_SKIP;
      }
      // Skip submenu triggers that are inside the submenu they open
      const ariaControls = node.getAttribute("aria-controls");

      if (ariaControls === root.id) {
        return NodeFilter.FILTER_SKIP;
      }

      return NodeFilter.FILTER_ACCEPT;
    }
  });
}

/**
 * Returns the next enabled menu item after the current one, or null if none.
 */
export function getNextMenuItem(current: HTMLElement): HTMLElement | null {
  const root = current.closest('[role="menu"]');
  if (!root) return null;
  const walker = createMenuWalker(root as HTMLElement);
  let node = walker.currentNode as HTMLElement;
  // Find the current node
  while (node && node !== current) {
    node = walker.nextNode() as HTMLElement;
  }

  const next = walker.nextNode() as HTMLElement;

  // Get the next menu item
  return next;
}

/**
 * Returns the previous enabled menu item before the current one, or null if none.
 */
export function getPreviousMenuItem(current: HTMLElement): HTMLElement | null {
  const root = current.closest('[role="menu"]');
  if (!root) return null;
  const walker = createMenuWalker(root as HTMLElement);
  let node = walker.currentNode as HTMLElement;
  let previousNode: HTMLElement | null = null;
  // Find the current node and keep track of the previous one
  while (node && node !== current) {
    previousNode = node;
    node = walker.nextNode() as HTMLElement;
  }
  // Only return if previousNode is not the root
  if (previousNode === root) return null;
  return previousNode;
}

/**
 * Returns the first enabled menu item in the menu.
 */
export function getFirstMenuItem(root: HTMLElement): HTMLElement | null {
  const walker = createMenuWalker(root);
  const first = walker.nextNode() as HTMLElement;
  return first;
}

/**
 * Returns the last enabled menu item in the menu.
 */
export function getLastMenuItem(root: HTMLElement): HTMLElement | null {
  const walker = createMenuWalker(root);
  let lastNode: HTMLElement | null = null;
  let node: HTMLElement | null;
  while ((node = walker.nextNode() as HTMLElement)) {
    lastNode = node;
  }
  return lastNode;
}
