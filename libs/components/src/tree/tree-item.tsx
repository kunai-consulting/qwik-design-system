import {
  $,
  type PropsOf,
  Slot,
  component$,
  sync$,
  useComputed$,
  useContext,
  useOn,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { groupContextId } from "./tree-group";
import { TreeRootContextId } from "./tree-root";
import { CollapsibleRootBase } from "../collapsible/collapsible-root";

interface TreeItemProps extends PropsOf<"div"> {
  _index?: number;
  groupTrigger?: boolean;
  groupId?: string;
}

export const TreeItemBase = component$((props: TreeItemProps) => {
  const context = useContext(TreeRootContextId);
  const root = context.rootRef.value ?? document.body;
  const groupContext = useContext(groupContextId, null);
  const itemRef = useSignal<HTMLElement>();

  const handleKeyNavigation$ = $((e: KeyboardEvent) => {
    const visibilityCache = new WeakMap<HTMLElement, boolean>();
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
      if (visibilityCache.has(node)) {
        return visibilityCache.get(node) ?? false;
      }

      let current: HTMLElement | null = node;
      while (current) {
        if (current.hasAttribute("data-collapsible-content") && current.hidden) {
          visibilityCache.set(node, false);
          return false;
        }
        current = current.parentElement;
      }

      visibilityCache.set(node, true);
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
        let lastVisibleNode: Node | null = null;

        treeWalker.currentNode = root;
        let node = treeWalker.nextNode();

        while (node) {
          if (isNodeVisible(node as HTMLElement)) {
            lastVisibleNode = node;
          }
          node = treeWalker.nextNode();
        }

        if (lastVisibleNode) {
          (lastVisibleNode as HTMLElement).focus();
        }
        break;
      }
    }
  });

  const handleFocus$ = $((e: FocusEvent) => {
    context.currentFocusEl.value = e.target as HTMLElement;
  });

  const currLevelSig = useComputed$(() => {
    if (!groupContext?.level) {
      return 1;
    }

    if (props.groupTrigger) {
      return groupContext?.level;
    }

    return groupContext?.level + 1;
  });

  useTask$(({ track }) => {
    track(() => context.currentFocusEl.value);

    if (context.currentFocusEl.value?.hasAttribute("groupTrigger")) {
      console.log("GROUP TRIGGER");
      console.log(props.ref);
    }

    if (context.currentFocusEl.value === itemRef.value) {
      console.log(context.currentFocusEl.value);
    }
  });

  /**
   *  Todo: Change this to a sync$ passed to the Render component once v2 is released (sync QRL serialization issue)
   *
   */
  useOn(
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
  if (props.groupTrigger) {
    return props;
  }

  props._index = globalThis.treeItemCount;
  globalThis.treeItemCount++;
  return props;
});
