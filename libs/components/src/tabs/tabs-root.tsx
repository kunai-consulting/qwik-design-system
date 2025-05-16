import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { Render } from "../render/render";

export type TabsRootProps = PropsOf<"div">;

export const TabsRoot = component$((props: TabsRootProps) => {
  return (
    <Render fallback="div" {...props}>
      <Slot />
    </Render>
  );
});
