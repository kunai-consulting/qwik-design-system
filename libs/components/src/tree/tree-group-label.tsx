import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";

export const TreeGroupLabelBase = component$((props: PropsOf<"span">) => {
  return (
    <Render fallback="span" {...props}>
      <Slot />
    </Render>
  );
});

export const TreeGroupLabel = withAsChild(TreeGroupLabelBase);
