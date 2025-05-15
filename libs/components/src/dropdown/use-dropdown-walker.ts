export function useDropdownWalker() {
   function createDropdownWalker(root: HTMLElement) {
    return document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node: Element) => {
          if (
            !node.hasAttribute("data-qds-dropdown-item") ||
            node.hasAttribute("data-disabled") ||
            node.hasAttribute("disabled") ||
            node.hasAttribute("data-qds-dropdown-submenu-content") ||
            node.hasAttribute("data-qds-dropdown-content")
          ) {
            return NodeFilter.FILTER_SKIP;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
  }
  
  /**
   * Returns all dropdown items for a menu, including submenu triggers that reference this menu as their parent.
   * The root is the menu root element, and parentContentId is the menu's contentId.
   */
   function getDropdownMenuItems(root: HTMLElement, rootContentId: string): HTMLElement[] {
    // 1. Get all direct children of the root that are dropdown items
    const walker = createDropdownWalker(root);
    const items: HTMLElement[] = [];
    let node = walker.nextNode() as HTMLElement | null;
    while (node) {
      if (node.parentElement === root) {
        items.push(node);
      }
      node = walker.nextNode() as HTMLElement | null;
    }

    // 2. Find all triggers in the document that reference this root as their parent
    const triggers = Array.from(
      document.querySelectorAll<HTMLElement>(
        `[data-qds-dropdown-submenu-trigger][data-qds-dropdown-parent='${rootContentId}']`
      )
    ).filter(trigger => {
      const submenuRoot = trigger.closest('[data-qds-dropdown-submenu-content]');
      return !submenuRoot || submenuRoot === root;
    });

    // 3. Merge and sort by DOM order
    const all = [...items, ...triggers];
    all.sort((a, b) => {
      if (a === b) return 0;
      if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return -1;
    });
    return all;
  }
  
  function getNextDropdownItem(current: HTMLElement): HTMLElement | null {
    const root = current.closest('[role="menu"]');
    if (!root) return null;
    const walker = createDropdownWalker(root as HTMLElement);
    let node = walker.currentNode as HTMLElement;
    while (node && node !== current) {
      node = walker.nextNode() as HTMLElement;
    }
    return walker.nextNode() as HTMLElement;
  }
  
  function getPreviousDropdownItem(current: HTMLElement): HTMLElement | null {
    const root = current.closest('[role="menu"]');
    if (!root) return null;
    const walker = createDropdownWalker(root as HTMLElement);
    let node = walker.currentNode as HTMLElement;
    let previousNode: HTMLElement | null = null;
    while (node && node !== current) {
      previousNode = node;
      node = walker.nextNode() as HTMLElement;
    }
    return previousNode;
  }
  
  function getFirstDropdownItem(root: HTMLElement): HTMLElement | null {
    const walker = createDropdownWalker(root);
    return walker.nextNode() as HTMLElement;
  }
  
  function getLastDropdownItem(root: HTMLElement): HTMLElement | null {
    const walker = createDropdownWalker(root);
    let lastNode: HTMLElement | null = null;
    let node: HTMLElement | null;
    while ((node = walker.nextNode() as HTMLElement)) {
      lastNode = node;
    }
    return lastNode;
  }
  
   function focusFirstDropdownItem(root: HTMLElement) {
    const first = getFirstDropdownItem(root);
    if (first) first.focus();
  }

  
  return {
    createDropdownWalker,
    getNextDropdownItem,
    getPreviousDropdownItem,
    getFirstDropdownItem,
    getLastDropdownItem,
    focusFirstDropdownItem,
    getDropdownMenuItems
  };
} 