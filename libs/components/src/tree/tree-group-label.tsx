import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const TreeGroupLabelBase = component$((props: PropsOf<"span">) => {
  return (
    <Render fallback="span" {...props}>
      <Slot />
    </Render>
  );
});

export const TreeGroupLabel = withAsChild(TreeGroupLabelBase);
