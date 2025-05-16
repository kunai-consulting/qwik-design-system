import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { Render } from "../render/render";

export type TabsTriggerProps = PropsOf<"button">;

export const TabsTrigger = component$((props: TabsTriggerProps) => {
  return (
    <Render role="tab" fallback="button" {...props}>
      <Slot />
    </Render>
  );
});
