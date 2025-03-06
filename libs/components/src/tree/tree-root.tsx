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
  rootRef: Signal<HTMLDivElement | undefined>;
};

export const TreeRootContextId = createContextId<TreeRootContext>("tree-root");

export const TreeRootBase = component$((props: PropsOf<"div">) => {
  const rootRef = useSignal<HTMLDivElement>();

  const context: TreeRootContext = {
    rootRef
  };

  useContextProvider(TreeRootContextId, context);

  return (
    <Render ref={rootRef} role="tree" fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const TreeRoot = withAsChild(TreeRootBase);
