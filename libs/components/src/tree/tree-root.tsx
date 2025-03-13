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
  useSignal
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

type TreeRootContext = {
  rootRef: Signal<HTMLDivElement | undefined>;
  currentFocusEl: Signal<HTMLElement | undefined>;
  // First dimension is level, second dimension is index within that level
  itemRefs: Signal<Record<number, Record<number, Signal<HTMLElement | undefined>>>>;
};

declare global {
  var treeItemCount: number;
}

export const TreeRootContextId = createContextId<TreeRootContext>("tree-root");

export const TreeRootBase = component$((props: PropsOf<"div">) => {
  const rootRef = useSignal<HTMLDivElement>();
  const currentFocusEl = useSignal<HTMLElement>();
  const itemRefs = useSignal<
    Record<number, Record<number, Signal<HTMLElement | undefined>>>
  >({});

  const context: TreeRootContext = {
    rootRef,
    currentFocusEl,
    itemRefs
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
