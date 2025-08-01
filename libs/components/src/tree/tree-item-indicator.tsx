import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { Render } from "../render/render";

export const TreeItemIndicator = component$((props: PropsOf<"span">) => {
  return (
    <Render fallback="span" {...props}>
      <Slot />
    </Render>
  );
});
