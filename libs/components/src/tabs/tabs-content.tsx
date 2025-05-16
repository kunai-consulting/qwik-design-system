import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { Render } from "../render/render";

export type TabsContentProps = PropsOf<"div">;

export const TabsContent = component$((props: TabsContentProps) => {
  return (
    <Render role="tabpanel" fallback="div" {...props}>
      <Slot />
    </Render>
  );
});
