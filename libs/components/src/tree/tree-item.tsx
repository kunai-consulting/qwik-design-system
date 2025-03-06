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

export const TreeItemBase = component$((props: TreeItemProps) => {
  const context = useContext(TreeRootContextId);

  return (
    <Render role="treeitem" fallback="div" tabIndex={0} {...props}>
      <Slot />
    </Render>
  );
});

export const TreeItem = withAsChild(TreeItemBase, true);
