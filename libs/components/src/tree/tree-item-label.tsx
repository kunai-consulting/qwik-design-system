import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { Render } from "../render/render";

export const TreeItemLabel = component$((props: PropsOf<"span">) => {
  return (
    <Render fallback="span" tabIndex={-1} {...props}>
      <Slot />
    </Render>
  );
});
