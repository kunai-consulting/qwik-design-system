import {
  $,
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  isServer,
  sync$,
  useContext,
  useContextProvider,
  useId,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { useBoundSignal } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { CollapsibleRootBase } from "../collapsible/collapsible-root";
import { TreeRootContextId } from "./tree-root";
import { useTree } from "./use-tree";

type TreeItemContext = {
  id: string;
  level: number;
  isOpenSig: Signal<boolean>;
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
  const isOpenSig = useBoundSignal(props["bind:open"], false);
  const { getCurrentLevel } = useTree();
  const isHighlightedSig = useSignal(false);
  const level = getCurrentLevel(parentContext?.level);

  const itemContext: TreeItemContext = {
    id,
    level,
    isOpenSig
  };

  useContextProvider(itemContextId, itemContext);

  const handleFocus$ = $((e: FocusEvent) => {
    context.currentFocusEl.value = e.target as HTMLElement;
  });

  const handleKeyNavigation$ = $((e: KeyboardEvent) => {
    // ensure the tree can be exited
    if (e.key === "Tab") {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    const treeRoot = context.rootRef.value;
    if (!treeRoot) {
      return;
    }

    if (!context.currentFocusEl.value) {
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

    nextItem?.focus();
  });

  useTask$(({ track }) => {
    track(() => context.currentFocusEl.value);

    if (isServer) return;

    isHighlightedSig.value = context.currentFocusEl.value === itemRef.value;
  });

  const handleKeyDownSync$ = sync$((e: KeyboardEvent) => {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
  });

  return (
    <CollapsibleRootBase
      {...props}
      id={id}
      ref={itemRef}
      role="row"
      bind:open={isOpenSig}
      tabIndex={
        context.currentFocusEl.value === itemRef.value ||
        context.currentFocusEl.value === null
          ? 0
          : -1
      }
      onFocus$={[handleFocus$, props.onFocus$]}
      onKeyDown$={[handleKeyDownSync$, handleKeyNavigation$, props.onKeyDown$]}
      data-qds-tree-item
      data-level={level}
      aria-level={level}
      data-highlighted={isHighlightedSig.value}
      data-group
    >
      {/* NOTE: This span is required for the aria tree grid pattern, we give it display contents so that it does not break composition */}
      <div role="gridcell" style={{ display: "contents" }} tabIndex={-1}>
        <Slot />
      </div>
    </CollapsibleRootBase>
  );
});

export const TreeItem = withAsChild(TreeItemBase);
