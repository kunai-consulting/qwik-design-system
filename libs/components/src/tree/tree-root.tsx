import {
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useSignal
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

type TreeRootContext = {
  treeNodeRefs: Signal<HTMLElement[]>;
};

export const TreeRootContextId = createContextId<TreeRootContext>("tree-root");

export const TreeRootBase = component$((props: PropsOf<"div">) => {
  const treeNodeRefs = useSignal<HTMLElement[]>([]);

  const context: TreeRootContext = {
    treeNodeRefs
  };

  useContextProvider(TreeRootContextId, context);

  return (
    <Render role="tree" fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const TreeRoot = withAsChild(TreeRootBase);
