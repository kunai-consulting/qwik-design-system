import {
  $,
  type PropsOf,
  Slot,
  component$,
  createContextId,
  sync$,
  useContext,
  useContextProvider,
  useId,
  useOnWindow,
  useSignal
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { TreeRootContextId } from "./tree-root";
import { CollapsibleRootBase } from "../collapsible/collapsible-root";
import { useTree } from "./use-tree";

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
  const root = context.rootRef.value ?? document.body;

  const { getCurrentLevel } = useTree();

  const level = getCurrentLevel(parentContext?.level);

  const itemContext: TreeItemContext = {
    id,
    level
  };

  useContextProvider(itemContextId, itemContext);

  const handleFocus$ = $((e: FocusEvent) => {
    context.currentFocusEl.value = e.target as HTMLElement;
  });

  const handleKeyNavigation$ = $((e: KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const treeRoot = context.rootRef.value;
    if (!treeRoot) {
      console.log("No tree root found");
      return;
    }

    const allTreeItems = Array.from(
      treeRoot.querySelectorAll("[data-qds-tree-item]")
    ) as HTMLElement[];
    console.log("All tree items:", allTreeItems.length);

    const visibleTreeItems = allTreeItems.filter((item) => {
      const isInClosedContent = item.closest(
        "[data-qds-collapsible-content][data-closed]"
      );
      return !isInClosedContent;
    });
    console.log("Visible tree items:", visibleTreeItems.length);

    if (!context.currentFocusEl.value) {
      console.log("No current focus element");
      return;
    }

    const currentIndex = visibleTreeItems.indexOf(context.currentFocusEl.value);
    console.log("Current index:", currentIndex);

    if (currentIndex === -1) {
      console.log("Current element not found in visible items");
      return;
    }

    let nextIndex: number;
    switch (e.key) {
      case "ArrowDown":
        nextIndex = (currentIndex + 1) % visibleTreeItems.length;
        break;
      case "ArrowUp":
        nextIndex =
          (currentIndex - 1 + visibleTreeItems.length) % visibleTreeItems.length;
        break;
      case "ArrowRight": {
        const currentItem = context.currentFocusEl.value;
        const isCollapsed = currentItem?.hasAttribute("data-closed");
        if (isCollapsed) {
          isOpenSig.value = true;
          return;
        }
        nextIndex = (currentIndex + 1) % visibleTreeItems.length;
        break;
      }
      case "ArrowLeft": {
        const currentItem = context.currentFocusEl.value;
        const isExpanded = !currentItem?.hasAttribute("data-closed");
        if (isExpanded) {
          isOpenSig.value = false;
          return;
        }
        nextIndex =
          (currentIndex - 1 + visibleTreeItems.length) % visibleTreeItems.length;
        break;
      }
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = visibleTreeItems.length - 1;
        break;
      default:
        return;
    }

    console.log("Next index:", nextIndex, "Key pressed:", e.key);
    const nextItem = visibleTreeItems[nextIndex];
    console.log("Next item to focus:", nextItem);
    nextItem?.focus();
  });

  /**
   *  Todo: Change this to a sync$ passed to the Render component once v2 is 
   released (sync QRL serialization issue)
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
      role="treeitem"
      bind:open={isOpenSig}
      tabIndex={0}
      onFocus$={[handleFocus$, props.onFocus$]}
      onKeyDown$={[handleKeyNavigation$, props.onKeyDown$]}
      data-qds-tree-item
      data-level={level}
      aria-level={level}
      data-group
    >
      <Slot />
    </CollapsibleRootBase>
  );
});

export const TreeItem = withAsChild(TreeItemBase);
