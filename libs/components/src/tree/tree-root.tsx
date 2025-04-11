// no-bound-signal

import {
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useSignal
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

type TreeRootContext = {
  rootRef: Signal<HTMLDivElement | undefined>;
  currentFocusEl: Signal<HTMLElement | undefined>;
};

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

export const TreeRootBase = component$((props: PropsOf<"div">) => {
  const rootRef = useSignal<HTMLDivElement>();
  const currentFocusEl = useSignal<HTMLElement>();

  const context: TreeRootContext = {
    rootRef,
    currentFocusEl
  };

  useContextProvider(TreeRootContextId, context);

  return (
    <Render ref={rootRef} role="treegrid" fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const TreeRoot = withAsChild(TreeRootBase);
