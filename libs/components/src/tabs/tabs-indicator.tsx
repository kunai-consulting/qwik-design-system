import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { Render } from "../render/render";

export type TabsIndicatorProps = PropsOf<"div">;

export const TabsIndicator = component$((props: TabsIndicatorProps) => {
  return (
    <Render fallback="div" {...props}>
      <Slot />
    </Render>
  );
});
