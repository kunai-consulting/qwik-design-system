import {
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useContext,
  useTask$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { TreeRootContextId } from "./tree-root";

interface TreeItemProps extends PropsOf<"div"> {
  _index?: number;
  _nodePath?: string;
  _parentPath?: string;
  _siblingIndex?: number;
}

let count = 0;
let siblingCounter: Record<string, number> = {};

export const TreeItemBase = component$((props: TreeItemProps) => {
  const context = useContext(TreeRootContextId);

  console.log("INSIDE TREE ITEM BASE", props._index, props._nodePath);

  let currCount = count;

  return (
    <Render
      role="treeitem"
      fallback="div"
      tabIndex={0}
      data-count={currCount}
      data-path={props._nodePath}
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const TreeItem = withAsChild(TreeItemBase, false, (props) => {
  console.log("TreeItem", count);

  const parentPath = (props as any)._parentPath || "";

  if (!siblingCounter[parentPath]) {
    siblingCounter[parentPath] = 0;
  }

  const siblingIndex = siblingCounter[parentPath]++;
  const nodePath = parentPath ? `${parentPath}-${siblingIndex}` : `${siblingIndex}`;

  count++;
  props._index = count;

  props._nodePath = nodePath;

  props._parentPath = nodePath;
  props._siblingIndex = siblingIndex;

  console.log("props", props, "nodePath", nodePath);

  return props;
});
