import {
  $,
  type PropsOf,
  Slot,
  component$,
  sync$,
  useComputed$,
  useContext,
  useOn,
  useOnWindow,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { TreeRootContextId } from "./tree-root";

interface TreeItemProps extends PropsOf<"div"> {
  _index?: number;
}

export const TreeItemBase = component$((props: TreeItemProps) => {
  const context = useContext(TreeRootContextId);
  const isFocusedSig = useSignal(false);

  /**
   *  Todo: Change this to a sync$ passed to the Render component once v2 is released (sync QRL serialization issue)
   *
   */
  useOnWindow(
    "keydown",
    sync$((e: KeyboardEvent) => {
      const keys = ["ArrowDown", "ArrowUp"];

      if (!keys.includes(e.key)) return;
      if (!(e.target as Element)?.hasAttribute("data-qds-tree-item")) return;

      e.preventDefault();
    })
  );

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

    if (!context.currentFocusEl.value) return;
    treeWalker.currentNode = context.currentFocusEl.value;

    switch (e.key) {
      case "ArrowDown": {
        const nextNode = treeWalker.nextNode();
        if (nextNode) {
          (nextNode as HTMLElement).focus();
        }
        break;
      }

      case "ArrowUp": {
        const prevNode = treeWalker.previousNode();
        if (prevNode) {
          (prevNode as HTMLElement).focus();
        }
        break;
      }
    }
  });

  return (
    <Render
      role="treeitem"
      fallback="div"
      tabIndex={0}
      onKeyDown$={handleKeyNavigation$}
      onFocus$={(e, el) => {
        context.currentFocusEl.value = el;
        console.log(context.currentFocusEl.value);
        isFocusedSig.value = true;
      }}
      onBlur$={() => {
        isFocusedSig.value = false;
      }}
      data-qds-tree-item
      data-focus={isFocusedSig.value}
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const TreeItem = withAsChild(TreeItemBase, true);

/**
 *  <Tree.Item />
 *  <Tree.Group>
 *    <Tree.Group>
 *     <Tree.Item></Tree.Item> <--- how do I know I'm nested
 *    <Tree.Item></Tree.Item>
 *    </Tree.Group>
 *  </Tree.Group>
 */

/**
 *  <Tree.Item />
 *  <Tree.Group>
 *    <Tree.Item />
 *  </Tree.Group>
 *  <Tree.Group>
 *    <Tree.Item />
 * </Tree.Group>
 */
