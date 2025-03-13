import {
  $,
  type PropsOf,
  Slot,
  component$,
  createContextId,
  sync$,
  useComputed$,
  useContext,
  useContextProvider,
  useId,
  useOnWindow,
  useSignal,
  useTask$,
  useVisibleTask$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { TreeRootContextId } from "./tree-root";
import { CollapsibleRootBase } from "../collapsible/collapsible-root";

type TreeItemContext = {
  id: string;
  level: number;
};

export const itemContextId = createContextId<TreeItemContext>("tree-item");

interface TreeItemProps extends PropsOf<typeof CollapsibleRootBase> {
  _index?: number;
  groupTrigger?: boolean;
  groupId?: string;
}

export const TreeItemBase = component$((props: TreeItemProps) => {
  const context = useContext(TreeRootContextId);
  const parentContext = useContext(itemContextId, null);
  const id = useId();
  const itemRef = useSignal<HTMLElement>();
  const isOpenSig = useSignal(false);

  // default level is 1, if there's a parent, increment its level
  const level = parentContext ? parentContext.level + 1 : 1;

  const itemContext: TreeItemContext = {
    id,
    level
  };

  useTask$(({ cleanup }) => {
    const level = parentContext ? parentContext.level + 1 : 1;
    const index = props._index ?? 0;

    // Get parent ID if it exists
    const parentId = parentContext?.id;

    console.log(
      `Registering tree item at level ${level}, index ${index}, parent: ${parentId || "none"}`
    );

    // Register this item in the tree store with improved structure
    context.treeStore[index] = {
      id,
      level,
      index,
      ref: itemRef,
      isOpen: isOpenSig,
      parentId,
      children: context.treeStore[index]?.children || {}
    };

    // If this is a child item, add it to its parent's children correctly
    if (parentId) {
      // Find the parent node by searching all nodes
      const parentNodes = Object.values(context.treeStore).filter(
        (node) => node.id === parentId
      );

      if (parentNodes.length > 0) {
        const parentNode = parentNodes[0];

        // Initialize children object if it doesn't exist
        if (!parentNode.children) {
          parentNode.children = {};
        }

        // Add this node as a child of the parent
        parentNode.children[index] = context.treeStore[index];

        console.log(`Added item ${index} as child of parent ${parentId}`);
      }
    }

    console.log("Tree store:", context.treeStore);

    // Cleanup when component unmounts
    cleanup(() => {
      console.log(`Cleaning up tree item at level ${level}, index ${index}`);

      // First, remove this node from any parent's children
      if (parentId) {
        // Find and update the parent
        for (const node of Object.values(context.treeStore)) {
          if (node.id === parentId && node.children && node.children[index]) {
            delete node.children[index];
            break;
          }
        }
      }

      // Then remove the node itself from the tree store
      delete context.treeStore[index];
    });
  });

  useVisibleTask$(({ track }) => {
    track(() => context.treeStore);

    console.log("Tree store:", context.treeStore);
  });

  useContextProvider(itemContextId, itemContext);

  const currLevelSig = useComputed$(() => {
    if (!itemContext?.level) {
      return 1;
    }

    return itemContext?.level;
  });

  const handleKeyNavigation$ = $((e: KeyboardEvent) => {
    console.log("Key pressed:", e.key);

    // Build a flat list of all visible items from the tree structure
    const visibleItems: Array<{ node: any; element: HTMLElement }> = [];

    // Helper to check if an element is visible (not in a collapsed section)
    const isVisible = (el: HTMLElement | undefined): boolean => {
      if (!el) return false;

      // Check if this item is in a hidden collapsible content
      let parent = el.parentElement;
      while (parent) {
        if (parent.hasAttribute("data-collapsible-content") && parent.hidden) {
          return false;
        }
        parent = parent.parentElement;
      }

      return true;
    };

    // Helper to recursively collect visible items
    const collectVisibleItems = (nodes: Record<string | number, any> = {}) => {
      // Get all nodes sorted by index
      const sortedIndices = Object.keys(nodes)
        .map(Number)
        .sort((a, b) => a - b);

      for (const idx of sortedIndices) {
        const node = nodes[idx];
        const element = node.ref?.value;

        if (element && isVisible(element)) {
          visibleItems.push({ node, element });

          // If this node has children and is open, process them too
          if (
            node.children &&
            Object.keys(node.children).length > 0 &&
            node.isOpen?.value
          ) {
            collectVisibleItems(node.children);
          }
        }
      }
    };

    // Start collecting from the root level nodes
    const rootNodes = Object.values(context.treeStore)
      .filter((node) => !node.parentId)
      .reduce(
        (acc, node) => {
          acc[node.index] = node;
          return acc;
        },
        {} as Record<number, any>
      );

    collectVisibleItems(rootNodes);

    console.log("Visible items:", visibleItems.length);

    if (visibleItems.length === 0) return;

    // Find current index in visible items
    const currentIndex = visibleItems.findIndex((item) => item.element === itemRef.value);
    console.log("Current item index:", currentIndex);

    if (currentIndex === -1) return;

    switch (e.key) {
      case "ArrowDown": {
        if (currentIndex < visibleItems.length - 1) {
          console.log("Moving to next item");
          visibleItems[currentIndex + 1].element.focus();
        }
        break;
      }

      case "ArrowUp": {
        if (currentIndex > 0) {
          console.log("Moving to previous item");
          visibleItems[currentIndex - 1].element.focus();
        }
        break;
      }

      case "Home": {
        console.log("Moving to first item");
        visibleItems[0].element.focus();
        break;
      }

      case "End": {
        console.log("Moving to last item");
        visibleItems[visibleItems.length - 1].element.focus();
        break;
      }

      case "ArrowRight": {
        // Right arrow only opens the collapsible
        if (!isOpenSig.value) {
          console.log("Opening node");
          isOpenSig.value = true;
        }
        break;
      }

      case "ArrowLeft": {
        if (isOpenSig.value) {
          // If expanded, collapse it
          console.log("Collapsing node");
          isOpenSig.value = false;
        } else if (parentContext) {
          // If already collapsed and has a parent, go to parent
          console.log("Looking for parent");

          // Find the parent node
          const parentItem = visibleItems.find(
            (item) => item.node.id === parentContext.id
          );

          if (parentItem) {
            console.log("Moving to parent");
            parentItem.element.focus();
          }
        }
        break;
      }
    }
  });

  const handleFocus$ = $((e: FocusEvent) => {
    context.currentFocusEl.value = e.target as HTMLElement;
  });

  /**
   *  Todo: Change this to a sync$ passed to the Render component once v2 is released (sync QRL serialization issue)
   *
   */
  useOnWindow(
    "keydown",
    sync$((e: KeyboardEvent) => {
      if (!(e.target as Element)?.hasAttribute("data-qds-tree-item")) return;
      const keys = ["ArrowDown", "ArrowUp", "Home", "End"];

      if (!keys.includes(e.key)) return;

      e.preventDefault();
    })
  );

  return (
    <CollapsibleRootBase
      {...props}
      ref={itemRef}
      role="gridcell"
      bind:open={isOpenSig}
      tabIndex={itemRef.value === context.currentFocusEl.value ? 0 : -1}
      onKeyDown$={[handleKeyNavigation$, props.onKeyDown$]}
      onFocus$={[handleFocus$, props.onFocus$]}
      data-qds-tree-item
      data-level={currLevelSig.value}
      aria-level={currLevelSig.value}
      data-group
    >
      <Slot />
    </CollapsibleRootBase>
  );
});

export const TreeItem = withAsChild(TreeItemBase, (props) => {
  props._index = globalThis.treeItemCount;
  globalThis.treeItemCount++;
  return props;
});
