import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";

export const TreeRootBase = component$((props: PropsOf<"div">) => {
  return (
    <Render role="tree" fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const TreeRoot = withAsChild(TreeRootBase);
