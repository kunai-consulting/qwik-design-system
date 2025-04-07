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

    if (!context.currentFocusEl.value) {
      console.log("No current focus element");
      return;
    }

    const {
      getNextVisibleItem,
      getPreviousVisibleItem,
      getFirstVisibleItem,
      getLastVisibleItem
    } = useTree();
    const currentItem = context.currentFocusEl.value;

    let nextItem: HTMLElement | null = null;
    switch (e.key) {
      case "ArrowDown":
        nextItem = getNextVisibleItem(currentItem);
        break;
      case "ArrowUp":
        nextItem = getPreviousVisibleItem(currentItem);
        break;
      case "ArrowRight": {
        const isCollapsed = currentItem.hasAttribute("data-closed");
        if (isCollapsed) {
          isOpenSig.value = true;
        }
        return;
      }
      case "ArrowLeft": {
        const isExpanded = !currentItem.hasAttribute("data-closed");
        if (isExpanded) {
          isOpenSig.value = false;
        }
        return;
      }
      case "Home":
        nextItem = getFirstVisibleItem(treeRoot);
        break;
      case "End":
        nextItem = getLastVisibleItem(treeRoot);
        break;
      default:
        return;
    }

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
