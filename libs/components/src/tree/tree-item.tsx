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

  useContextProvider(itemContextId, itemContext);

  const currLevelSig = useComputed$(() => {
    if (!itemContext?.level) {
      return 1;
    }

    return itemContext?.level;
  });

  useTask$(() => {
    const level = currLevelSig.value;
    const index = props._index ?? 0;

    console.log(`Registering tree item at level ${level}, index ${index}`);

    // Make a copy of the current structure
    const newItemRefs = { ...context.itemRefs.value };

    // Ensure level exists
    if (!newItemRefs[level]) {
      newItemRefs[level] = {};
    }

    // Register this item at its level and index - store the Signal
    newItemRefs[level][index] = itemRef;

    // Update the context with the new structure
    context.itemRefs.value = newItemRefs;

    console.log("item refs", context.itemRefs.value);
  });

  useVisibleTask$(() => {
    console.log("item refs", context.itemRefs.value);
  });

  const handleKeyNavigation$ = $((e: KeyboardEvent) => {
    console.log("Key pressed:", e.key);

    // Build a flat list of all visible items from the tree structure
    const visibleItems: HTMLElement[] = [];

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

    // Process all levels in order
    const levels = Object.keys(context.itemRefs.value)
      .map(Number)
      .sort((a, b) => a - b);

    for (const lvl of levels) {
      const levelItems = context.itemRefs.value[lvl];
      if (!levelItems) continue;

      // Get indices in sorted order
      const indices = Object.keys(levelItems)
        .map(Number)
        .sort((a, b) => a - b);

      for (const idx of indices) {
        const itemSignal = levelItems[idx];
        if (itemSignal?.value && isVisible(itemSignal.value)) {
          visibleItems.push(itemSignal.value);
        }
      }
    }

    console.log("Visible items:", visibleItems.length);

    if (visibleItems.length === 0) return;

    // Find current index in visible items
    const currentIndex = visibleItems.findIndex((item) => item === itemRef.value);
    console.log("Current item index:", currentIndex);

    switch (e.key) {
      case "ArrowDown": {
        if (currentIndex < visibleItems.length - 1) {
          console.log("Moving to next item");
          visibleItems[currentIndex + 1].focus();
        }
        break;
      }

      case "ArrowUp": {
        if (currentIndex > 0) {
          console.log("Moving to previous item");
          visibleItems[currentIndex - 1].focus();
        }
        break;
      }

      case "Home": {
        console.log("Moving to first item");
        visibleItems[0].focus();
        break;
      }

      case "End": {
        console.log("Moving to last item");
        visibleItems[visibleItems.length - 1].focus();
        break;
      }

      case "ArrowRight": {
        if (!isOpenSig.value) {
          // If closed, open it
          console.log("Opening node");
          isOpenSig.value = true;
        } else {
          // If open, move to first child if available
          console.log("Looking for first child");

          // Look for the next item with a level one deeper
          const nextItem = visibleItems.find((item, i) => {
            if (i <= currentIndex) return false;
            const itemLevel = parseInt(item.getAttribute("data-level") || "1", 10);
            return itemLevel === currLevelSig.value + 1;
          });

          if (nextItem) {
            console.log("Moving to first child");
            nextItem.focus();
          }
        }
        break;
      }

      case "ArrowLeft": {
        if (isOpenSig.value) {
          // If expanded, collapse it
          console.log("Collapsing node");
          isOpenSig.value = false;
        } else if (currLevelSig.value > 1) {
          // If already collapsed and not at top level, go to parent
          console.log("Looking for parent");

          // Find the parent (previous item with one level up)
          for (let i = currentIndex - 1; i >= 0; i--) {
            const item = visibleItems[i];
            const itemLevel = parseInt(item.getAttribute("data-level") || "1", 10);

            if (itemLevel === currLevelSig.value - 1) {
              console.log("Moving to parent");
              item.focus();
              break;
            }
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
