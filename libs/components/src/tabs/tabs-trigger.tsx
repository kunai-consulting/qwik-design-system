import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export type TabsTriggerProps = PropsOf<"button">;

export const TabsTriggerBase = component$((props: TabsTriggerProps) => {
  return (
    <Render role="tab" fallback="button" {...props}>
      <Slot />
    </Render>
  );
});

export const TabsTrigger = withAsChild(TabsTriggerBase);
