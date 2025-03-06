import {
  $,
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useContext,
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

  const handleArrowDownKey$ = $((e: KeyboardEvent) => {
    if (e.key !== "ArrowDown") return;
    e.preventDefault();

    const currentFocused = document.querySelector("[data-qds-tree-item][data-focus]");
    if (!currentFocused) return;

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

    treeWalker.currentNode = currentFocused;

    const nextNode = treeWalker.nextNode();

    if (nextNode) {
      (nextNode as HTMLElement).focus();
    }
  });

  return (
    <Render
      role="treeitem"
      fallback="div"
      tabIndex={0}
      onKeyDown$={handleArrowDownKey$}
      onFocus$={() => {
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
