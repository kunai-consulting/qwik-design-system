import {
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  sync$,
  useContext,
  useContextProvider,
  useOnWindow,
  useSignal,
  useStore
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

type TreeRootContext = {
  rootRef: Signal<HTMLDivElement | undefined>;
  currentFocusEl: Signal<HTMLElement | undefined>;
  treeStore: TreeData;
};

declare global {
  var treeItemCount: number;
}

export const TreeRootContextId = createContextId<TreeRootContext>("tree-root");

export type TreeNode = {
  id: string;
  level: number;
  index: number;
  ref: Signal<HTMLElement | undefined>;
  isOpen?: Signal<boolean>;
  parentId?: string;
  children?: Record<number, TreeNode>;
};

type TreeData = Record<string, TreeNode>;

export const TreeRootBase = component$((props: PropsOf<"div">) => {
  const rootRef = useSignal<HTMLDivElement>();
  const currentFocusEl = useSignal<HTMLElement>();
  const treeStore = useStore<TreeData>({});

  const context: TreeRootContext = {
    rootRef,
    currentFocusEl,
    treeStore
  };

  useContextProvider(TreeRootContextId, context);

  return (
    <Render ref={rootRef} role="treegrid" fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const TreeRoot = withAsChild(TreeRootBase, (props) => {
  globalThis.treeItemCount = 0;
  return props;
});
