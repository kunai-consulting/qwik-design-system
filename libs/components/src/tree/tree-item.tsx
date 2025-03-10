import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { groupContextId } from "./tree-group";
import { TreeRootContextId } from "./tree-root";

interface TreeItemProps extends PropsOf<"div"> {
  _index?: number;
  groupTrigger?: boolean;
  groupId?: string;
}

export const TreeItemBase = component$((props: TreeItemProps) => {
  const context = useContext(TreeRootContextId);
  const root = context.rootRef.value ?? document.body;
  const groupContext = useContext(groupContextId, null);

  const handleKeyNavigation$ = $((e: KeyboardEvent) => {
    const treeWalker = document.createTreeWalker(
      context.rootRef.value ?? document.body,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node) {
          return (node as Element).hasAttribute("data-qds-tree-item")
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        }
      }
    );

    const isNodeVisible = (node: HTMLElement): boolean => {
      let current: HTMLElement | null = node;
      while (current) {
        if (current.hasAttribute('data-collapsible-content') && current.hidden) return false;
    
        current = current.parentElement;
      }
      return true;
    };

    if (!context.currentFocusEl.value) return;
    treeWalker.currentNode = context.currentFocusEl.value;

    switch (e.key) {
      case "ArrowDown": {
        let nextNode = treeWalker.nextNode();
        while (nextNode && !isNodeVisible(nextNode as HTMLElement)) {
          nextNode = treeWalker.nextNode();
        }
        if (nextNode) {
          (nextNode as HTMLElement).focus();
        }
        break;
      }

      case "ArrowUp": {
        let prevNode = treeWalker.previousNode();
        while (prevNode && !isNodeVisible(prevNode as HTMLElement)) {
          prevNode = treeWalker.previousNode();
        }
        if (prevNode) {
          (prevNode as HTMLElement).focus();
        }
        break;
      }

      case "Home": {
        treeWalker.currentNode = root;
        let firstNode = treeWalker.nextNode();
        while (firstNode && !isNodeVisible(firstNode as HTMLElement)) {
          firstNode = treeWalker.nextNode();
        }
        if (firstNode) {
          (firstNode as HTMLElement).focus();
        }
        break;
      }

      case "End": {
        treeWalker.currentNode = root;
        while (treeWalker.lastChild()) {
          // go to last child until we can't go deeper
        }

        if (!(treeWalker.currentNode as Element).hasAttribute("data-qds-tree-item")) {
          treeWalker.previousNode();
        }
        
        while (treeWalker.currentNode && !isNodeVisible(treeWalker.currentNode as HTMLElement)) {
          treeWalker.previousNode();
        }

        if (treeWalker.currentNode && treeWalker.currentNode !== root) {
          (treeWalker.currentNode as HTMLElement).focus();
        }
        break;
      }
    }
  });

  const handleFocus$ = $((e: FocusEvent) => {
    context.currentFocusEl.value = e.target as HTMLElement;
  });

  function getLevel() {
    if (!groupContext?.level) {
      return 1;
    }

    if (props.groupTrigger) {
      return groupContext?.level;
    }

    return groupContext?.level + 1;
  }

  return (
    <Render
      {...props}
      role="gridcell"
      fallback="div"
      tabIndex={0}
      onKeyDown$={[handleKeyNavigation$, props.onKeyDown$]}
      onFocus$={[handleFocus$, props.onFocus$]}
      data-qds-tree-item
      data-level={getLevel()}
      data-group
    >
      <Slot />
    </Render>
  );
});

export const TreeItem = withAsChild(TreeItemBase);
