import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { Render } from "../render/render";

export type TabsListProps = PropsOf<"div">;

export const TabsList = component$((props: TabsListProps) => {
  return (
    <Render role="tablist" fallback="div" {...props}>
      <Slot />
    </Render>
  );
});
