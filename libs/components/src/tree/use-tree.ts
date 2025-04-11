export function useTree() {
  // default level is 1, if there's a parent, increment its level
  function getCurrentLevel(level: number | undefined) {
    if (!level) {
      return 1;
    }

    return level;
  }

  function createTreeWalker(root: HTMLElement) {
    return document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node: Element) => {
        // Only accept tree items that are visible
        if (!node.hasAttribute("data-qds-tree-item")) {
          return NodeFilter.FILTER_SKIP;
        }

        // Skip items that are inside closed collapsible content
        const isInClosedContent = node.closest(
          "[data-qds-collapsible-content][data-closed]"
        );
        if (isInClosedContent) {
          return NodeFilter.FILTER_SKIP;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    });
  }

  function getNextVisibleItem(current: HTMLElement): HTMLElement | null {
    const root = current.closest('[role="treegrid"]');
    if (!root) return null;

    const walker = createTreeWalker(root as HTMLElement);
    let node = walker.currentNode as HTMLElement;

    // Find the current node
    while (node && node !== current) {
      node = walker.nextNode() as HTMLElement;
    }

    // Get the next visible node
    return walker.nextNode() as HTMLElement;
  }

  function getPreviousVisibleItem(current: HTMLElement): HTMLElement | null {
    const root = current.closest('[role="treegrid"]');
    if (!root) return null;

    const walker = createTreeWalker(root as HTMLElement);
    let node = walker.currentNode as HTMLElement;
    let previousNode: HTMLElement | null = null;

    // Find the current node and keep track of the previous one
    while (node && node !== current) {
      previousNode = node;
      node = walker.nextNode() as HTMLElement;
    }

    return previousNode;
  }

  function getFirstVisibleItem(root: HTMLElement): HTMLElement | null {
    const walker = createTreeWalker(root);
    return walker.nextNode() as HTMLElement;
  }

  function getLastVisibleItem(root: HTMLElement): HTMLElement | null {
    const walker = createTreeWalker(root);
    let lastNode: HTMLElement | null = null;
    let node: HTMLElement | null;

    while ((node = walker.nextNode() as HTMLElement)) {
      lastNode = node;
    }

    return lastNode;
  }

  return {
    getCurrentLevel,
    createTreeWalker,
    getNextVisibleItem,
    getPreviousVisibleItem,
    getFirstVisibleItem,
    getLastVisibleItem
  };
}
